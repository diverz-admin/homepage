#!/usr/bin/env node
/**
 * 중국 플랫폼 로고 4종을 "보이는 크기"가 같은 정사각 PNG로 다시 뽑는다.
 *
 *   node scripts/normalize-china-platform-logos.mjs
 *
 * 입력: public/images/imc/<slug>.png (받은 원본)
 * 출력: public/images/service/global/platforms/<slug>.png (정사각 투명 PNG)
 *
 * 왜 필요한가 — 받은 원본은 아이콘이 파일에서 차지하는 비율이 제각각이다.
 *
 *   xiaohongshu 500x500 캔버스에 잉크 344x344 (47%)
 *   tiktok      320x320 캔버스에 잉크 132x132 (17%)
 *   dianping    457x458 캔버스에 잉크가 꽉 참   (100%)
 *   wechat      554x554 캔버스에 잉크가 꽉 참   (100%)
 *
 * 이걸 그대로 같은 픽셀 크기로 렌더하면 틱톡만 유난히 작아 보인다. 화면
 * 쪽에서 로고마다 크기를 손으로 맞추는 대신, 여기서 한 번 정리해 둔다.
 *
 * 맞추는 방식 —
 * 1) 배경(투명 또는 흰색) 여백을 잘라 실제 잉크 상자를 구한다.
 * 2) 잉크 상자의 긴 변이 캔버스의 INK_SPAN 이 되도록 키운다. 넷 다
 *    앱 아이콘(둥근 사각형·원)이라 긴 변 기준으로 맞추면 눈에 같아 보인다.
 *    (로고 모양이 제각각인 묶음이라면 면적 기준이 낫다 —
 *    scripts/normalize-imc-logos.mjs 참고.)
 * 3) 정사각 투명 캔버스 가운데에 얹는다.
 *
 * 로고를 더하거나 뺄 때는 아래 FILES 와 lib/site.ts 의
 * ecommerceMarketing.platforms 를 같이 고친다.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const srcDir = join(root, "public", "images", "imc");
const outDir = join(root, "public", "images", "service", "global", "platforms");

/** 원본 파일명(확장자 제외) = 출력 slug. */
const FILES = ["xiaohongshu", "tiktok", "dianping", "wechat"];

/** 출력 캔버스 한 변(px). 화면에서 32px로 쓰지만 고해상도 화면을 위해 크게 둔다. */
const CANVAS = 256;
/** 잉크 상자의 긴 변이 캔버스에서 차지할 비율. 넷을 같은 값으로 맞춘다. */
const INK_SPAN = 0.94;

await mkdir(outDir, { recursive: true });

for (const slug of FILES) {
  // trim은 좌상단 픽셀 색을 배경으로 본다. 투명 배경이든 흰 배경(RGB)이든
  // 같은 호출로 여백이 떨어진다. threshold를 조금 올려 JPEG 잔여 노이즈가
  // 남은 흰 배경도 함께 잘라 낸다.
  const { data: trimmed, info } = await sharp(join(srcDir, `${slug}.png`))
    .trim({ threshold: 10 })
    .png()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const scale = (CANVAS * INK_SPAN) / Math.max(width, height);
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));

  const resized = await sharp(trimmed)
    .resize(w, h, { fit: "fill" })
    .png()
    .toBuffer();

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
    `${slug.padEnd(13)} ink ${String(width).padStart(4)}x${String(height).padStart(4)} → ${String(w).padStart(3)}x${String(h).padStart(3)} on ${CANVAS}`
  );
}

console.log(`\n${FILES.length}개 → ${outDir}`);
