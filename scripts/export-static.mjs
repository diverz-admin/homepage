#!/usr/bin/env node
/**
 * 공유용 정적 HTML 뽑기.
 *
 *   node scripts/export-static.mjs
 *
 * 결과: out/ (페이지별 HTML + 에셋), diverz-homepage-static.zip
 *
 * 정적 export는 POST 라우트 핸들러를 지원하지 않으므로 빌드 동안만 app/api 를
 * 언더스코어 폴더(= Next.js private folder, 라우팅 제외)로 옮겼다가 되돌린다.
 * 중간에 죽어도 원상복구되도록 finally + 시그널 핸들러로 감싼다.
 */
import { execFileSync } from "node:child_process";
import { existsSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const apiDir = join(root, "app", "api");
const parkedDir = join(root, "app", "_api-parked-for-export");
const outDir = join(root, "out");
const zipPath = join(root, "diverz-homepage-static.zip");

let parked = false;

function restore() {
  if (parked && existsSync(parkedDir)) {
    renameSync(parkedDir, apiDir);
    parked = false;
  }
}

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    restore();
    process.exit(1);
  });
}

try {
  if (existsSync(parkedDir)) {
    throw new Error(
      `이전 실행이 비정상 종료된 것 같습니다. ${parkedDir} 를 app/api 로 되돌린 뒤 다시 실행하세요.`
    );
  }

  rmSync(outDir, { recursive: true, force: true });
  rmSync(zipPath, { force: true });

  if (existsSync(apiDir)) {
    renameSync(apiDir, parkedDir);
    parked = true;
  }

  execFileSync("npx", ["next", "build"], {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, STATIC_EXPORT: "1" },
  });
} finally {
  restore();
}

writeFileSync(
  // 파일명은 ASCII로 — zip 한글 파일명이 Windows에서 깨진다.
  join(outDir, "READ-ME-FIRST.txt"),
  `DIVERZ 홈페이지 미리보기 (정적 HTML)
====================================

[여는 방법]
index.html 을 그냥 더블클릭하면 디자인이 깨집니다.
아래처럼 간단한 로컬 서버로 띄워서 봐주세요.

  1) 이 폴더(out)를 압축 해제한 위치에서 터미널을 엽니다.
  2) 다음 중 하나를 실행합니다.

     - Node.js 가 있는 경우:   npx serve .
     - Python 3 가 있는 경우:  python3 -m http.server 8080

  3) 브라우저에서 안내된 주소(예: http://localhost:8080)를 엽니다.

[포함된 페이지]
  /             메인
  /who-we-are/  회사 소개
  /service/     서비스
  /solution/    솔루션
  /work/        성과
  /contact/     문의

[참고]
CONTACT 페이지의 문의 폼은 이 미리보기에서 전송되지 않습니다.
서버가 필요한 기능이라 정적 HTML 버전에서는 화면만 확인할 수 있습니다.
`,
  "utf8"
);

// macOS 기본 zip. -x 로 .DS_Store 제외.
execFileSync("zip", ["-qr", zipPath, "out", "-x", "*.DS_Store"], {
  cwd: root,
  stdio: "inherit",
});

console.log(`\n✓ out/ 생성 완료`);
console.log(`✓ ${zipPath}`);
