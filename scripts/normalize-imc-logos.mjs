#!/usr/bin/env node
/**
 * IMC 채널 로고를 원형 칩에 맞는 정사각 캔버스로 다시 뽑는다.
 *
 *   node scripts/normalize-imc-logos.mjs
 *
 * 입력: "Service page/IMC Marketing/" 의 원본 (webp/png/jpeg 섞여 있고 이름도 제각각)
 * 출력: public/images/imc/<slug>.png (정사각 투명 PNG)
 *
 * 원본은 출처가 다 달라서 비율도 여백도 제각각이다(쿠팡 3840x871, Meta
 * 4000x4000, 네이버 447x447 …). 그대로 원형 칩에 넣으면 가로로 긴 로고만
 * 크게 보이므로, 여기서 "보이는 크기"를 한 번에 맞춘다.
 *
 * 크기 맞추는 방식 —
 * 1) 배경(투명 또는 흰색) 여백을 잘라내 실제 잉크 상자를 구한다.
 * 2) 잉크 "면적"이 캔버스의 TARGET_INK_RATIO가 되도록 배율을 잡는다.
 *    (높이나 폭 기준으로 맞추면 비율이 다른 로고끼리 크기가 확 벌어진다)
 * 3) 잉크 상자의 대각선이 DIAG_MAX를 넘지 않게 조인다 — 칩이 원이라
 *    정사각 캔버스의 네 귀퉁이는 원 밖으로 나간다. 대각선을 재는 게
 *    가로/세로를 따로 재는 것보다 정확하다.
 * 4) 정사각 투명 캔버스 가운데에 얹는다.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const srcDir = join(root, "Service page", "IMC Marketing");
const outDir = join(root, "public", "images", "imc");

/**
 * 원본 파일명 → 출력 slug. 원본 이름이 "images.png", "tipdilz7wysq-…png"처럼
 * 알아볼 수 없어서 여기서 한 번 이름을 붙인다. 표시용 이름은 lib/site.ts의
 * imcChannels에 있다 — 새 로고를 넣을 때 두 곳을 같이 고쳐야 한다.
 */
const FILES = {
  "meta_PNG12.png": "meta",
  "google_logo_g_logo_icon_159348.webp": "google",
  "google-display-network.png": "google-display-network",
  "images.jpeg": "tiktok",
  "images.png": "naver",
  "Coupang_logo.svg.webp": "coupang",
  "tipdilz7wysq-6MFgksIufbe05YAtrhLAd1.png": "karrot",
};

/** 출력 캔버스 한 변(px). 칩이 커져도 흐려지지 않을 만큼만 크게. */
const CANVAS = 320;
/** 잉크가 캔버스 넓이에서 차지할 목표 비율. 눈으로 맞춰 정한 값이다. */
const TARGET_INK_RATIO = 0.17;
/** 잉크 상자 대각선 상한. 원 안에 여유를 두고 들어가는 값. */
const DIAG_MAX = CANVAS * 0.9;

await mkdir(outDir, { recursive: true });

for (const [file, slug] of Object.entries(FILES)) {
  // trim은 좌상단 픽셀 색을 배경으로 본다. 투명 배경이든 흰 배경(jpeg)이든
  // 같은 호출로 여백이 떨어진다.
  const { data: trimmed, info } = await sharp(join(srcDir, file))
    .trim({ threshold: 1 })
    .png()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;

  // 1) 면적 기준 배율
  let scale = Math.sqrt((CANVAS * CANVAS * TARGET_INK_RATIO) / (width * height));
  // 2) 원 안에 들어가도록 대각선으로 조인다
  scale = Math.min(scale, DIAG_MAX / Math.hypot(width, height));

  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));

  const resized = await sharp(trimmed).resize(w, h, { fit: "fill" }).toBuffer();

  const out = await sharp({
    create: {
      width: CANVAS,
      height: CANVAS,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: resized,
        top: Math.round((CANVAS - h) / 2),
        left: Math.round((CANVAS - w) / 2),
      },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();

  await writeFile(join(outDir, `${slug}.png`), out);
  console.log(
    `${slug.padEnd(24)} ink ${String(width).padStart(4)}x${String(height).padStart(4)} → ${String(w).padStart(3)}x${String(h).padStart(3)}`
  );
}

console.log(`\n${Object.keys(FILES).length}개 → ${outDir}`);
