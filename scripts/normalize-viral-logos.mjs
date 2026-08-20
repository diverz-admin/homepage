#!/usr/bin/env node
/**
 * 바이럴 채널 로고를 작은 정사각 마크로 다시 뽑는다.
 *
 *   node scripts/normalize-viral-logos.mjs
 *
 * 입력: "Service page/viral/" 의 원본 (png/jpeg 섞여 있고 이름도 제각각)
 * 출력: public/images/viral/<slug>.png (정사각 투명 PNG)
 *
 * scripts/normalize-imc-logos.mjs 와 같은 방식이다. 원본이 출처가 달라
 * 비율도 여백도 제각각(네이버 447x447, 당근 1000x1100, 플레이스 500x300)이라
 * 그대로 나란히 두면 크기가 들쭉날쭉해 보인다.
 *
 * 1) 배경(투명 또는 흰색) 여백을 잘라 실제 잉크 상자를 구한다.
 * 2) 잉크 "면적"이 캔버스의 TARGET_INK_RATIO가 되도록 배율을 잡는다.
 *    (높이나 폭 기준으로 맞추면 비율이 다른 로고끼리 크기가 확 벌어진다)
 * 3) 잉크 상자가 안전 상자를 넘지 않게 조인다.
 * 4) 정사각 투명 캔버스 가운데에 얹는다.
 *
 * IMC 쪽과 달리 원형 칩에 넣는 게 아니라 텍스트 옆에 놓는 마크라,
 * 대각선 대신 가로/세로를 각각 재서 캔버스에 꽉 차게 둔다.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const srcDir = join(root, "Service page", "viral");
const outDir = join(root, "public", "images", "viral");

/**
 * 원본 파일명 → 출력 slug. slug는 lib/site.ts의 채널 en 값과 짝을 이룬다 —
 * 로고를 더하거나 뺄 때 두 곳을 같이 고쳐야 한다.
 */
const FILES = {
  "naver.png": "naver",
  "instagram.jpeg": "instagram",
  "danggeun.png": "danggeun",
  "naver place.png": "naver-place",
};

/** 출력 캔버스 한 변(px). 화면에서는 40px 안팎으로 쓰지만 고해상도 대비로 크게 둔다. */
const CANVAS = 256;
/** 잉크가 캔버스 넓이에서 차지할 목표 비율. */
const TARGET_INK_RATIO = 0.62;
const MAX_W = CANVAS * 0.96;
const MAX_H = CANVAS * 0.96;

await mkdir(outDir, { recursive: true });

for (const [file, slug] of Object.entries(FILES)) {
  // trim은 좌상단 픽셀 색을 배경으로 본다. 투명 배경이든 흰 배경(jpeg)이든
  // 같은 호출로 여백이 떨어진다.
  const { data: trimmed, info } = await sharp(join(srcDir, file))
    .trim({ threshold: 1 })
    .png()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;

  let scale = Math.sqrt((CANVAS * CANVAS * TARGET_INK_RATIO) / (width * height));
  scale = Math.min(scale, MAX_W / width, MAX_H / height);

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
    `${slug.padEnd(14)} ink ${String(width).padStart(4)}x${String(height).padStart(4)} → ${String(w).padStart(3)}x${String(h).padStart(3)}`
  );
}

console.log(`\n${Object.keys(FILES).length}개 → ${outDir}`);
