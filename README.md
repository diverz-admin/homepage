# 다이버즈 DIVERZ 홈페이지

IMC 마케팅 그룹 다이버즈의 회사 홈페이지(https://diverz.kr)입니다.

- Next.js 16 (App Router), React, TypeScript, Tailwind CSS
- 문의 저장: Supabase (`contacts` 테이블)
- 문의 알림 메일: Resend
- 배포: Vercel (`main` 브랜치에 푸시하면 자동 배포)

## 로컬 실행

```bash
npm install
npm run dev
```

http://localhost:3000 에서 확인합니다. 다른 포트를 쓰려면 다음과 같이 실행합니다.

```bash
npm run dev -- -p 3003
```

배포용 빌드 확인은 `npm run build`, 린트는 `npm run lint` 로 합니다.

## 환경 변수

로컬에서는 프로젝트 루트에 `.env.local` 파일을 만들고, 배포 환경에서는 Vercel 프로젝트 설정의 Environment Variables 에 넣습니다. 실제 키 값은 저장소에 커밋하지 않습니다.

| 변수 | 필수 | 용도 |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | 예 | Supabase 프로젝트 주소 (`https://xxxx.supabase.co`, 경로 없이) |
| `SUPABASE_SERVICE_ROLE_KEY` | 예 | 서버에서 문의를 저장할 때 쓰는 service_role 키 |
| `RESEND_API_KEY` | 아니오 | 문의 알림 메일 발송 키. 없으면 메일 없이 저장만 합니다 |
| `CONTACT_TO_EMAIL` | 아니오 | 알림 메일 받는 주소 (기본값 `info@diverz.kr`) |
| `CONTACT_FROM_EMAIL` | 아니오 | 알림 메일 보내는 주소 (기본값 `onboarding@resend.dev`). Resend에서 인증한 도메인 주소를 씁니다 |

Supabase 테이블 구조는 `supabase/schema.sql` 에 있습니다. 새 프로젝트라면 Supabase SQL Editor 에서 이 파일을 한 번 실행합니다.

## 폴더 구조

| 경로 | 내용 |
| --- | --- |
| `app/` | 페이지 (`/`, `/who-we-are`, `/service`, `/service/[slug]`, `/work`, `/recruiting`, `/contact`), 문의 API (`app/api/contact`), robots.txt/sitemap/RSS |
| `components/` | 화면 컴포넌트. 문의 폼은 `components/contact-form.tsx` |
| `lib/site.ts` | 화면 문구와 데이터 대부분 (회사 정보, 서비스, 실적 등). 문구 수정은 주로 여기서 합니다 |
| `lib/seo.ts` | 사이트 제목/설명, 검색엔진 인증 값, GA4 측정 ID |
| `lib/email.ts`, `lib/supabase.ts` | 문의 알림 메일, DB 연결 |
| `public/images/` | 이미지 |
| `e2e/` | Playwright 자동 테스트 |
| `scripts/` | 로고 이미지 정리, 정적 HTML 추출 등 보조 스크립트 |

## 문의 폼

`/contact` 폼을 제출하면 `app/api/contact` 가 입력을 검사하고 Supabase 에 저장한 뒤 알림 메일을 보냅니다. 접수에 성공하면 메타 픽셀 `Lead` 이벤트를 보냅니다.

스팸 방지 장치가 두 가지 있습니다. 화면에 보이지 않는 함정 입력칸(`website`)이 채워져 있거나, 폼이 뜬 뒤 3초 안에 제출되면 봇으로 보고 저장/메일 없이 성공처럼 응답합니다. 차단 기록은 Vercel 로그에 `[contact] spam blocked` 로 남습니다.

## 자동 테스트

```bash
npx playwright install chromium
npm run test:e2e
```

`E2E_BASE_URL` 이 없으면 테스트가 개발 서버를 직접 띄웁니다. 실제 DB 저장을 확인하는 테스트는 `.env.local` 의 Supabase 값이 있을 때만 실행되고, 테스트가 만든 문의는 끝나면 지웁니다.

## 문구 작성 규칙

화면에 보이는 문구에서 낱말을 나열할 때 가운뎃점(`·`) 대신 슬래시(`/`)를 씁니다. 예: `퍼포먼스/바이럴/글로벌 마케팅`. 자세한 내용은 `AGENTS.md` 에 있습니다.
