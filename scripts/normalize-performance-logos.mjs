#!/usr/bin/env node
/**
 * 퍼포먼스 마케팅 블록 로고 6개를 정사각 칩에 맞는 캔버스로 다시 뽑는다.
 *
 *   node scripts/normalize-performance-logos.mjs
 *
 * 입력: "Service page/Performance/" 의 원본 (webp/png/jpeg 섞여 있고 이름도 제각각)
 * 출력: public/images/performance/<slug>.png (정사각 투명 PNG)
 *
 * scripts/normalize-imc-logos.mjs와 같은 방식(잉크 면적 기준 배율 + 대각선
 * 상한)을 그대로 쓴다. Meta와 Google Analytics 원본은 심볼 아래 워드마크
 * 텍스트가 붙어 있어 다른 로고(아이콘만 있는)와 안 맞으므로, trim 전에
 * 위쪽 심볼 영역만 잘라낸다(CROP_TOP).
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const srcDir = join(root, "Service page", "Performance");
const outDir = join(root, "public", "images", "performance");

/** 원본 파일명 → 출력 slug. 표시용 이름은 lib/site.ts의 performanceChannels에 있다. */
const FILES = {
  "images.jpeg": "instagram",
  "images.png": "naver",
  "Meta-Symbol.png": "meta",
  "Google__G__logo.svg.webp": "google",
  "Youtube_logo.png": "youtube",
  "구글애널리틱스로고이미지.png": "google-analytics",
};

/** 워드마크가 붙은 원본만, 위에서부터 이 비율까지만 남기고 잘라낸다. */
const CROP_TOP = {
  "Meta-Symbol.png": 0.667,
  "구글애널리틱스로고이미지.png": 0.7,
};

const CANVAS = 320;
const TARGET_INK_RATIO = 0.17;
const DIAG_MAX = CANVAS * 0.9;

await mkdir(outDir, { recursive: true });

for (const [file, slug] of Object.entries(FILES)) {
  const srcPath = join(srcDir, file);

  // extract()와 trim()을 한 파이프라인에 이어 붙이면 sharp가 trim의 크롭
  // 영역을 원본 캔버스 기준으로 계산해 "bad extract area"로 죽는다.
  // extract 결과를 버퍼로 한 번 끊어낸 뒤 그 버퍼에 trim을 걸어야 한다.
  const cropRatio = CROP_TOP[file];
  let input = srcPath;
  if (cropRatio) {
    const meta = await sharp(srcPath).metadata();
    input = await sharp(srcPath)
      .extract({
        left: 0,
        top: 0,
        width: meta.width,
        height: Math.round(meta.height * cropRatio),
      })
      .png()
      .toBuffer();
  }

  const { data: trimmed, info } = await sharp(input)
    .trim({ threshold: 1 })
    .png()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;

  let scale = Math.sqrt((CANVAS * CANVAS * TARGET_INK_RATIO) / (width * height));
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
    `${slug.padEnd(18)} ink ${String(width).padStart(4)}x${String(height).padStart(4)} → ${String(w).padStart(3)}x${String(h).padStart(3)}`
  );
}

console.log(`\n${Object.keys(FILES).length}개 → ${outDir}`);
