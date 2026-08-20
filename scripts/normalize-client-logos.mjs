#!/usr/bin/env node
/**
 * "업체 로고/" 폴더의 신규 로고 20개를 client-logos 카드 캔버스(480×180, 16:6)에
 * 맞춰 다시 뽑는다.
 *
 *   node scripts/normalize-client-logos.mjs
 *
 * 입력: "업체 로고/" 원본(이미 배경 제거된 투명 PNG, 이름은 제각각)
 * 출력: public/images/clients/<slug>.png (480×180 투명 PNG)
 *
 * scripts/normalize-performance-logos.mjs와 같은 방식(잉크 면적 기준 배율)을
 * 쓴다. 캔버스가 정사각이 아니라 16:6이라, 대각선 상한 대신 가로/세로
 * 각각의 상한을 따로 둬서 가로로 아주 긴 워드마크가 캔버스를 넘지 않게 한다.
 *
 * 기존 26개(public/images/clients/axa.png 등)의 트림 후 바운딩박스 면적을
 * 캔버스 대비로 재보면 평균 0.11 근방이라, 여기서도 같은 값을 목표로 삼아
 * 새 로고들이 같은 "잉크 무게"로 보이게 맞춘다.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const srcDir = join(root, "업체 로고");
const outDir = join(root, "public", "images", "clients");

/** 원본 파일명 → 출력 slug. 표시용 이름은 lib/site.ts의 clientLogos에 있다. */
const FILES = {
  "image 12.png": "monocus",
  "image 20.png": "the-hanoi-foot-body",
  "image 24.png": "shine-u-clinic",
  "image 4.png": "salon-de-haru",
  "image-removebg-preview (38) 1.png": "ziphone",
  "image-removebg-preview (39) 1.png": "udada",
  "image-removebg-preview (40) 1.png": "linsen-dining",
  "image-removebg-preview (41) 1.png": "sealy",
  "image-removebg-preview (43) 1.png": "odorr",
  "image-removebg-preview (44) 1.png": "care-by-me",
  "image-removebg-preview (45) 1.png": "allerman",
  "image-removebg-preview (46) 1.png": "ipoomgo",
  "image-removebg-preview (47) 1.png": "uffia",
  "image-removebg-preview (48) 1.png": "kkanbu-chicken",
  "image-removebg-preview (49) 1.png": "okipa",
  "image-removebg-preview (51) 1.png": "the-liter",
  "image-removebg-preview (52) 1.png": "dr-robbin",
  "image-removebg-preview (53) 1.png": "hometown-spring",
  "image-removebg-preview (54) 1.png": "wave-hearing",
  "image-removebg-preview (55) 1.png": "bodybean-pilates",
};

const CANVAS_W = 480;
const CANVAS_H = 180;
const TARGET_INK_RATIO = 0.11;
// 가로/세로 각각의 상한 — 대각선 하나로 묶으면 세로로 긴 로고가 폭을
// 다 차지하도록 계산돼 버릴 수 있어(캔버스가 정사각이 아니므로), 축마다 잡는다.
const MAX_W = CANVAS_W * 0.82;
const MAX_H = CANVAS_H * 0.78;

await mkdir(outDir, { recursive: true });

for (const [file, slug] of Object.entries(FILES)) {
  const srcPath = join(srcDir, file);

  const { data: trimmed, info } = await sharp(srcPath)
    .trim({ threshold: 8 })
    .png()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;

  let scale = Math.sqrt((CANVAS_W * CANVAS_H * TARGET_INK_RATIO) / (width * height));
  scale = Math.min(scale, MAX_W / width, MAX_H / height);

  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));

  const resized = await sharp(trimmed).resize(w, h, { fit: "fill" }).toBuffer();

  const out = await sharp({
    create: {
      width: CANVAS_W,
      height: CANVAS_H,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: resized,
        top: Math.round((CANVAS_H - h) / 2),
        left: Math.round((CANVAS_W - w) / 2),
      },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();

  await writeFile(join(outDir, `${slug}.png`), out);
  console.log(
    `${slug.padEnd(22)} ink ${String(width).padStart(4)}x${String(height).padStart(4)} → ${String(w).padStart(3)}x${String(h).padStart(3)}`
  );
}

console.log(`\n${Object.keys(FILES).length}개 → ${outDir}`);
