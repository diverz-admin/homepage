import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/reveal";
import LandingForm from "@/components/landing/landing-form";
import LiveStatsBar from "@/components/landing/live-stats-bar";
import AdLabelMockup from "@/components/landing/ad-label-mockup";
import SlotHeatmap from "@/components/landing/slot-heatmap";
import TypingChat from "@/components/landing/typing-chat";
import LogicVisual from "@/components/landing/logic-visual";
import { company } from "@/lib/site";
import { rankingLanding as lp } from "@/lib/landing";

/**
 * 숨겨진 광고 랜딩 — 네이버 쇼핑(스마트스토어) 상위노출 무료 진단.
 *
 * 주소를 아는 사람만 들어오는 비밀 페이지다. "숨김"은 네 겹이다.
 *  1) 주소가 무작위 문자열(/lp/9q7v0hft4z)이라 짐작으로 찾아올 수 없다.
 *     이 폴더 이름이 곧 주소다. 바꾸면 lib/landing.ts 의 path 도 같이 바꾼다.
 *  2) 메뉴(lib/site.ts nav), 푸터, 사이트맵 어디에도 링크를 걸지 않는다.
 *     robots.txt 에 Disallow 로 적지도 않는다 — 적으면 그 파일을 보는
 *     누구에게나 주소가 드러난다.
 *  3) robots noindex/nofollow — 주소가 어디서 새어 나가도 검색에 안 잡힌다.
 *  4) app/(landing) 묶음이라 사이트 헤더/푸터가 붙지 않는다.
 * 광고 링크(메타 등)나 직접 전달한 주소로만 들어오는 지면이다.
 *
 * 섹션 순서와 흐름은 lib/landing.ts 머리 주석 참고.
 */
export const metadata: Metadata = {
  title: "네이버 쇼핑 상위노출 무료 진단",
  description:
    "팔리지 않는 건 상품 탓이 아닙니다. 다이버즈가 지금 내 상품 순위를 무료로 진단해 드립니다.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
  openGraph: {
    title: "팔리지 않는 건 상품 탓이 아닙니다. | DIVERZ",
    description: "지금 내 상품 순위, 다이버즈가 무료로 진단해 드립니다.",
    type: "website",
    locale: "ko_KR",
    images: ["/images/hero-deep.png"],
  },
};

/** "\n" 을 줄바꿈으로 편다. 좁은 화면에서도 정해 둔 자리에서만 끊긴다. */
function Lines({ text }: { text: string }) {
  return text.split("\n").map((line, i) => (
    <span key={i} className="block">
      {line}
    </span>
  ));
}

/*
 * 간격 규칙 — 모든 섹션이 같은 박자로 읽히도록 여기서만 정한다.
 *  SECTION_Y   섹션 위아래 여백(섹션 사이 = 이 값의 두 배)
 *  GAP_HEAD    섹션 제목 묶음 → 본문(이미지/그림/목록)
 *  GAP_BLOCK   한 섹션 안에서 이야기가 넘어가는 큰 덩어리 사이
 *  GAP_LEAD    짧은 이끄는 말 → 그 말이 가리키는 내용
 *  TITLE/BODY  섹션 제목 크기와 제목 아래 설명 한 줄
 */
const SECTION_Y = "py-24 sm:py-36";
const GAP_HEAD = "mt-12 sm:mt-16";
const GAP_BLOCK = "mt-20 sm:mt-28";
const GAP_LEAD = "mt-8 sm:mt-10";
const TITLE =
  "font-display text-[clamp(2.2rem,5vw,4rem)] leading-[1.25] font-bold tracking-tight break-keep";
const BODY = "mt-6 text-fluid-lg leading-relaxed text-white/60";

/** CREW 원 아이콘 — 코드 / 사람 / 대화. */
function CrewIcon({ name }: { name: "code" | "person" | "talk" }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {name === "code" && (
        <>
          <path d="m8 7-5 5 5 5" />
          <path d="m16 7 5 5-5 5" />
          <path d="m13.5 4-3 16" />
        </>
      )}
      {name === "person" && (
        <>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </>
      )}
      {name === "talk" && (
        <>
          <path d="M4 5h16v11H9l-5 4z" />
          <path d="M8 10h8" />
        </>
      )}
    </svg>
  );
}

/**
 * REALITY 결과 카드의 순위 그래프. 위쪽이 상위 순위다. 선은 pathLength=1 로
 * 맞춰 두고, 카드(.group/spark)가 보이면 dashoffset 을 0 으로 풀어 그린다.
 * 끝점에 점 하나.
 */
const TREND_PATHS = {
  spike: { d: "M4 62 L50 60 L78 16 L104 18 L134 56 L196 60", end: [196, 60] },
  shaky: {
    d: "M4 46 L28 26 L50 52 L74 20 L96 48 L120 24 L146 58 L170 30 L196 50",
    end: [196, 50],
  },
  drop: { d: "M4 24 L60 22 L104 28 L132 30 L156 64 L196 72", end: [196, 72] },
} as const;

function RealityTrend({ kind }: { kind: keyof typeof TREND_PATHS }) {
  const { d, end } = TREND_PATHS[kind];
  return (
    <svg aria-hidden viewBox="0 0 200 80" className="h-24 w-full" fill="none">
      {[20, 40, 60].map((y) => (
        <line
          key={y}
          x1="0"
          x2="200"
          y1={y}
          y2={y}
          stroke="rgb(255 255 255 / 0.06)"
        />
      ))}
      <path
        d={d}
        pathLength={1}
        stroke="var(--color-accent)"
        strokeOpacity="0.8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="[stroke-dasharray:1] [stroke-dashoffset:1] transition-[stroke-dashoffset] delay-300 duration-[1600ms] ease-out group-data-[visible=true]/spark:[stroke-dashoffset:0] motion-reduce:[stroke-dashoffset:0]"
      />
      <circle
        cx={end[0]}
        cy={end[1]}
        r="4"
        fill="var(--color-accent)"
        className="opacity-0 transition-opacity delay-[1800ms] duration-300 group-data-[visible=true]/spark:opacity-100 motion-reduce:opacity-100"
      />
    </svg>
  );
}

function Check() {
  return (
    <span
      aria-hidden
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[0.65rem] text-accent"
    >
      ✓
    </span>
  );
}

export default function RankingLandingPage() {
  return (
    <main className="lp-motion flex-1 bg-abyss pb-36 text-foreground sm:pb-28">
      {/* 상단 띠 — 로고 + 앵커 메뉴. 광고로 들어온 사람을 다른 지면으로
          흘려보내지 않도록 홈 링크는 걸지 않는다. */}
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="page-container flex h-16 items-center justify-between gap-6 sm:h-20">
          <span className="font-display text-lg font-black tracking-[0.2em] text-white">
            {company.nameEn}
          </span>
          <nav className="hidden items-center gap-8 lg:flex">
            {lp.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-white/70 transition hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href="#apply"
            className="hidden rounded-full border border-white/20 px-5 py-2 text-xs font-bold text-white transition hover:border-accent hover:text-accent sm:inline-block"
          >
            {lp.hero.cta}
          </a>
        </div>
      </header>

      {/* 1. RANK BOARD — 최상단. 상품별 순위 추이 이미지 6장.
          위 여백은 겹쳐 놓인 상단 띠(header) 자리다. */}
      <section
        id="results"
        className="scroll-mt-4 pt-32 pb-24 sm:pt-40 sm:pb-36"
      >
        <div className="page-container">
          {/* 페이지 첫 화면이라 다른 섹션 머리(Head)보다 훨씬 크게 쓴다.
              둘째 줄은 "쾅" 하고 꽂히고(slam), 그 순간 제목 묶음이 흔들린다
              (slam-shake). 키프레임은 globals.css "광고 랜딩 히어로" 묶음. */}
          <Reveal className="text-center">
            <div className="slam-stage slam-shake">
              <h1 className="font-display text-[clamp(2.8rem,8.5vw,7rem)] leading-[1.1] font-bold tracking-tight break-keep">
                <span className="block text-white">
                  {lp.rankBoard.title[0]}
                </span>
                <span className="slam block">
                  {/* 꽂히는 움직임(slam)과 네온 빛(neon)은 둘 다 animation 을
                      쓰므로 겹치지 않게 감싸는 칸을 나눈다. */}
                  <span className="neon">{lp.rankBoard.title[1]}</span>
                </span>
              </h1>
              <p className={`mx-auto max-w-2xl ${BODY}`}>{lp.rankBoard.body}</p>
            </div>
          </Reveal>
          <div className={`mx-auto max-w-6xl ${GAP_HEAD}`}>
            {/* 넓은 화면은 한 줄에 3장씩 두 줄, 중간 폭은 2장씩, 좁은 화면은 1장씩. */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {lp.rankBoard.images.map((image, i) => (
                <Reveal
                  key={image.src}
                  delay={(i % 3) * 100}
                  className="fx-pop"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={1396}
                    height={1127}
                    sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                    className="h-auto w-full rounded-xl shadow-[0_10px_30px_rgb(0_0_0/0.35)]"
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 1-1. CLIENT TALK — 고객사 대화 캡처가 옆으로 저절로 흘러간다.
          리스트를 두 벌 이어 붙이고 -50%까지 옮겨 끊김 없이 돈다(클라이언트
          로고 월과 같은 방식). 마우스를 올리면 멈춰서 읽을 수 있다.
          양 끝은 마스크로 흐리게 지워 화면 밖으로 빠지는 느낌을 준다. */}
      <section id="talk" className={`scroll-mt-4 overflow-hidden ${SECTION_Y}`}>
        <div className="page-container">
          {/* 다른 섹션 머리(Head)보다 크게 — 1페이지의 의미 제목과 같은 크기. */}
          <Reveal className="fx-title text-center">
            <h2 className={`text-white ${TITLE}`}>
              <Lines text={lp.chats.title} />
            </h2>
            <p className={`mx-auto max-w-2xl ${BODY}`}>{lp.chats.body}</p>
          </Reveal>
        </div>
        <Reveal className={`fx-pop ${GAP_HEAD}`}>
          <ul className="sr-only">
            {lp.chats.images.map((image) => (
              <li key={image.src}>{image.alt}</li>
            ))}
          </ul>
          <div className="marquee-row overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
            <div
              aria-hidden
              className="animate-marquee flex w-max gap-5 sm:gap-6"
              style={{ animationDuration: "45s" }}
            >
              {[...lp.chats.images, ...lp.chats.images].map((image, i) => (
                <div
                  key={`${image.src}-${i}`}
                  className="w-[240px] shrink-0 overflow-hidden rounded-2xl border border-line bg-deep shadow-[0_10px_30px_rgb(0_0_0/0.35)] sm:w-[300px] lg:w-[340px]"
                >
                  <Image
                    src={image.src}
                    alt=""
                    width={1036}
                    height={1518}
                    sizes="(min-width: 1024px) 340px, (min-width: 640px) 300px, 240px"
                    className="h-auto w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* 1-2. 1페이지의 의미 — 카톡 캡처 다음. 왼쪽 큰 제목, 오른쪽 구좌별
          반응 분포도(검색 결과 화면 두 개 + 열지도). */}
      <section className={SECTION_Y}>
        {/* 제목과 그림을 한 덩어리로 가운데 모은다(양 끝으로 벌리지 않음).
            넓은 화면에서 제목은 그림 위쪽 선에 맞춘다. */}
        <div className="page-container flex flex-col gap-12 sm:gap-16 lg:flex-row lg:items-start lg:justify-center lg:gap-20 xl:gap-28">
          <Reveal className="fx-title lg:pt-2">
            <h2 className={`text-white ${TITLE}`}>
              <Lines text={lp.firstPage.title} />
            </h2>
            <p className={BODY}>{lp.firstPage.body}</p>
          </Reveal>
          <Reveal delay={150} className="fx-pop">
            <SlotHeatmap
              phones={lp.firstPage.phones}
              high={lp.firstPage.high}
              low={lp.firstPage.low}
              caption={lp.firstPage.caption}
              note={lp.firstPage.note}
            />
          </Reveal>
        </div>
      </section>

      {/* 1-3. TRUST — 광고 표시 없는 상단 노출의 신뢰. 대화 두 줄(고객사
          "최상단에는 광고가 있잖아요?" / 다이버즈 "맞습니다. 그런데,") →
          큰 제목 두 줄("광고 표시가 없는"에 밑줄 강조) → 검색 결과 그림. */}
      <section className={`${SECTION_Y}`}>
        <div className="page-container">
          {/* 대화 두 줄이 실제로 치듯 타이핑되고, 다 써지면 큰 제목이
              떠오른다(components/landing/typing-chat.tsx). */}
          <TypingChat
            asker={lp.trust.asker}
            question={lp.trust.objection}
            answerer={lp.trust.answerer}
            answer={lp.trust.bridge}
          >
            <div className={`text-center ${GAP_HEAD}`}>
              <h2 className={TITLE}>
                {lp.trust.title.map((line, li) => (
                  <span key={li} className="block">
                    {line.map(([text, tone]) =>
                      tone === "mark" ? (
                        // 핵심 낱말 — 흰색으로 밝히고 아래에 강조색 띠가
                        // 왼쪽부터 그어진다(제목이 떠오른 뒤).
                        <span
                          key={text}
                          className="relative inline-block text-white after:absolute after:inset-x-0 after:bottom-[0.06em] after:-z-10 after:h-[0.32em] after:origin-left after:scale-x-0 after:rounded-sm after:bg-accent/35 after:transition-transform after:delay-[700ms] after:duration-700 after:ease-out after:content-[''] group-data-[visible=true]/title:after:scale-x-100 motion-reduce:after:scale-x-100"
                        >
                          {text}
                        </span>
                      ) : (
                        <span
                          key={text}
                          className={
                            tone === "dim" ? "text-white/30" : "text-white"
                          }
                        >
                          {text}
                        </span>
                      ),
                    )}
                  </span>
                ))}
              </h2>
            </div>
          </TypingChat>

          <div className={GAP_HEAD}>
            <AdLabelMockup {...lp.trust.mockup} />
          </div>
        </div>
      </section>

      {/* 1-4. REALITY — "유입만 늘리면 오르지 않나요?" → 대행사 영업 연락
          (휴대폰 알림 카드 셋) → "그런데 결과는?" → 결과 카드 셋(순위 그래프). */}
      <section id="reality" className={`scroll-mt-4 ${SECTION_Y}`}>
        <div className="page-container">
          <Reveal className="fx-title text-center">
            <h2 className={TITLE}>
              {/* 두 줄 — 회색 질문 앞부분 / 흰색 뒷부분 */}
              {lp.reality.title.map(([text, strong]) => (
                <span
                  key={text}
                  className={`block ${strong ? "text-white" : "text-white/35"}`}
                >
                  {text}
                </span>
              ))}
            </h2>
          </Reveal>

          <Reveal className={`fx-title text-center ${GAP_HEAD}`}>
            <p className="text-fluid-lg font-medium text-white/60">
              {lp.reality.lead}
            </p>
          </Reveal>
          {/* 휴대폰 알림처럼 쌓인 영업 연락 셋 — 좌우로 살짝 어긋나며 차례로
              내려앉는다. */}
          <ul className={`mx-auto grid max-w-md gap-3 ${GAP_LEAD}`}>
            {lp.reality.claims.map((claim, i) => (
              <Reveal
                as="li"
                key={claim}
                delay={i * 220}
                className={`fx-bubble ${i === 1 ? "sm:translate-x-10" : i === 2 ? "sm:-translate-x-6" : "sm:-translate-x-10"}`}
              >
                <div className="flex items-start gap-3.5 rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3.5 shadow-[0_12px_30px_rgb(0_0_0/0.3)] backdrop-blur-sm sm:px-5 sm:py-4">
                  <span
                    aria-hidden
                    className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white/70"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4.5 w-4.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 5h16v11H9l-5 4z" />
                    </svg>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center justify-between text-xs text-white/45">
                      <span className="font-bold text-white/60">
                        {lp.reality.sender}
                      </span>
                      <span>{lp.reality.sentAt[i]}</span>
                    </p>
                    <p className="mt-1 text-sm font-bold break-keep text-white sm:text-base">
                      {claim}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal className={`fx-title text-center ${GAP_BLOCK}`}>
            <p className="text-fluid-xl font-bold text-white">
              {lp.reality.turn}
            </p>
          </Reveal>
          {/* 결과 카드 셋 — 위에 순위 그래프(위가 상위)가 화면에 들어오면
              그려지고, 아래 두 줄 문구. */}
          <ul
            className={`mx-auto grid max-w-5xl gap-5 md:grid-cols-3 ${GAP_LEAD}`}
          >
            {lp.reality.outcomes.map((item, i) => (
              <Reveal
                as="li"
                key={item.strong}
                delay={i * 150}
                className="group/spark fx-pop rounded-2xl border border-line bg-deep/50 p-6 sm:p-7"
              >
                <RealityTrend kind={item.trend} />
                <p className="mt-6 text-sm font-medium text-white/55 sm:text-base">
                  {item.lead}
                </p>
                <p className="mt-1 text-fluid-xl font-bold text-white">
                  ‘{item.strong}’
                </p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 1-5. 경고 — 업계의 현실 바로 아래. 위에서 본 약속 세 줄을 크게
          다시 꺼내 놓고, 화면에 들어오면 한 줄씩 강조색 선으로 그어 지운다
          (after: 가상 요소를 scale-x 로 늘린다). 그 아래 경고 문구. */}
      <section className="pb-24 sm:pb-32">
        <div className="page-container">
          {/* 카드가 보이면: 약속 줄 지우기(~1.7s) → 경고 제목이 앞에서
              날아와 "쾅" 꽂히고(slam-in) 그 순간 카드가 흔들린다(slam-shake)
              → 설명이 떠오른다. 키프레임은 globals.css 히어로 묶음 것을 쓴다. */}
          <Reveal className="group/slam mx-auto max-w-3xl rounded-[2rem] border border-line bg-deep/50 px-6 py-14 text-center data-[visible=true]:animate-[slam-shake_0.45s_linear_2.1s_both] motion-reduce:animate-none sm:px-14 sm:py-16">
            <ul className="grid gap-3 sm:gap-4">
              {lp.reality.claims.map((claim, i) => (
                <Reveal
                  as="li"
                  key={claim}
                  delay={i * 250}
                  className="group/strike"
                >
                  <span className="relative inline-block after:absolute after:inset-x-[-0.15em] after:top-[52%] after:h-[3px] after:origin-left after:scale-x-0 after:rounded-full after:bg-accent after:transition-transform after:delay-500 after:duration-700 after:ease-in-out after:content-[''] group-data-[visible=true]/strike:after:scale-x-100 motion-reduce:after:scale-x-100 motion-reduce:after:transition-none font-display text-fluid-2xl font-bold break-keep text-white/30">
                    {claim}
                  </span>
                </Reveal>
              ))}
            </ul>
            <div className="mt-12 border-t border-line pt-10">
              <h3 className="font-display text-fluid-2xl font-bold break-keep text-white opacity-0 group-data-[visible=true]/slam:animate-[slam-in_0.5s_cubic-bezier(0.2,0.7,0.3,1)_1.8s_both] motion-reduce:opacity-100 motion-reduce:animate-none">
                {lp.reality.warning.title}
              </h3>
              <p className="mx-auto mt-3 max-w-xl opacity-0 transition-opacity duration-500 group-data-[visible=true]/slam:opacity-100 group-data-[visible=true]/slam:delay-[2300ms] motion-reduce:opacity-100 text-fluid-base leading-relaxed break-keep text-white/60">
                {lp.reality.warning.body}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 1-6. PLATFORM — "1등 포털이 그렇게 허술할까요?" 반문 → 답 →
          플랫폼 로직 카드 셋. */}
      <section className={`${SECTION_Y}`}>
        <div className="page-container">
          <Reveal className="fx-title text-center">
            <p className="font-display text-fluid-xl font-bold break-keep text-white/40">
              {lp.platform.question[0]}
              <br />
              {lp.platform.question[1]}
            </p>
            <h2 className="mt-6 font-display text-[clamp(2rem,4.6vw,3.6rem)] leading-[1.25] font-bold tracking-tight break-keep text-white">
              {lp.platform.answer[0]}{" "}
              <span className="text-accent">{lp.platform.answer[1]}</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-fluid-base leading-relaxed break-keep text-white/60">
              {lp.platform.body}
            </p>
          </Reveal>
          <ul className="mx-auto mt-16 grid max-w-6xl gap-5 md:grid-cols-3 sm:mt-20">
            {lp.platform.items.map((item, i) => (
              <Reveal
                as="li"
                key={item.title}
                delay={i * 120}
                className="fx-pop group/logic relative flex flex-col rounded-2xl border border-line bg-deep/50 p-4 transition-colors duration-300 hover:border-accent/40 sm:p-5"
              >
                <LogicVisual name={item.icon} />
                <div className="px-3 pt-7 pb-4 sm:px-4">
                  <p className="font-display text-sm font-bold tracking-widest text-accent/70 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 text-fluid-xl font-bold break-keep text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed break-keep text-white/60 sm:text-base">
                    <Lines text={item.body} />
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 1-7. SOLUTION — 위 섹션들과 같은 틀: 가운데 라벨 + 두 톤 제목 +
          설명, 그 아래 숫자 셋(10명 / 24시간 / 직접 개발), 그 아래 대응
          사이클 카드 넷(PLATFORM 카드와 같은 모양). 카드 사이는 → 로 잇고,
          맨 아래 "다시 감지로"가 고리를 닫는다. */}
      <section
        id="solution"
        className={`relative isolate scroll-mt-4 overflow-hidden ${SECTION_Y} pt-64 sm:pt-[22rem]`}
      >
        {/* 뒷배경 — 위에서 내려오는 V 자 판. 양옆이 높고 가운데가 내려와
            시선을 제목 한가운데로 모은다("답은 여기"). 판은 deep 으로 옅게
            밝고 아래·양옆으로 갈수록 사라진다. V 꼭짓점 선은 강조색이
            가운데로 갈수록 또렷해진다. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[min(1100px,140vw)] [--v-depth:150px] sm:[--v-depth:250px] [mask-image:linear-gradient(to_right,transparent,black_18%,black_82%,transparent)]"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(23_37_60/0.95),rgb(23_37_60/0.35)_55%,transparent)] [clip-path:polygon(0_0,50%_var(--v-depth),100%_0,100%_100%,0_100%)]" />
          <svg
            viewBox="0 0 100 14"
            preserveAspectRatio="none"
            className="absolute inset-x-0 top-0 h-(--v-depth) w-full"
            fill="none"
          >
            <defs>
              <linearGradient id="solution-v" x1="0" y1="0" x2="1" y2="0">
                <stop
                  offset="0"
                  stopColor="var(--color-accent)"
                  stopOpacity="0"
                />
                <stop
                  offset="0.5"
                  stopColor="var(--color-accent)"
                  stopOpacity="0.55"
                />
                <stop
                  offset="1"
                  stopColor="var(--color-accent)"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
            <path
              d="M0 0 L50 14 L100 0"
              stroke="url(#solution-v)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
        <div className="page-container">
          <Reveal className="fx-title text-center">
            <h2 className="font-display text-[clamp(2rem,4.6vw,3.6rem)] leading-[1.25] font-bold tracking-tight break-keep">
              <span className="block text-white/35">
                {lp.solution.title[0]}
              </span>
              <span className="block text-white">{lp.solution.title[1]}</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-fluid-base leading-relaxed break-keep text-white/60">
              {lp.solution.body}
            </p>
          </Reveal>

          {/* 전담 개발자 10명 — 사람 아이콘 열 개를 한 줄로 크게 세우고
              빠르게 하나씩 톡 나타나게 한다. 그 아래 나머지 숫자 둘. */}
          <Reveal delay={100} className="group/stats fx-pop">
            {lp.solution.stats
              .filter((stat) => "people" in stat)
              .map((stat) => (
                <div key={stat.label} className="mt-14 text-center sm:mt-16">
                  <p className="sr-only">{stat.label}</p>
                  <div
                    aria-hidden
                    className="mx-auto flex w-max flex-wrap justify-center gap-2 sm:gap-3.5"
                  >
                    {Array.from({ length: stat.people ?? 0 }, (_, i) => (
                      <svg
                        key={i}
                        viewBox="0 0 24 24"
                        className="h-7 w-7 translate-y-2 scale-50 text-white opacity-0 transition duration-300 ease-out group-data-[visible=true]/stats:translate-y-0 group-data-[visible=true]/stats:scale-100 group-data-[visible=true]/stats:opacity-100 motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:opacity-100 sm:h-12 sm:w-12"
                        style={{ transitionDelay: `${500 + i * 90}ms` }}
                        fill="currentColor"
                      >
                        <circle cx="12" cy="7" r="4" />
                        <path d="M4 21a8 8 0 0 1 16 0z" />
                      </svg>
                    ))}
                  </div>
                  <p
                    aria-hidden
                    className="mt-4 text-sm font-bold text-white/70 sm:text-base"
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            <dl className="mx-auto mt-10 grid max-w-xl grid-cols-2 divide-x divide-line sm:mt-12">
              {lp.solution.stats
                .filter((stat) => !("people" in stat))
                .map((stat) => (
                  <div key={stat.label} className="px-2 text-center">
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-none font-bold text-white tabular-nums">
                        {stat.value}
                      </span>
                      {stat.unit && (
                        <span className="ml-1 text-fluid-lg font-bold text-white/70">
                          {stat.unit}
                        </span>
                      )}
                      <span
                        aria-hidden
                        className="mt-3 block text-xs font-medium break-keep text-white/50 sm:text-sm"
                      >
                        {stat.label}
                      </span>
                    </dd>
                  </div>
                ))}
            </dl>
          </Reveal>

          <ol className="mx-auto mt-16 grid max-w-6xl gap-5 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
            {lp.solution.cycle.map((step, i) => (
              <Reveal
                as="li"
                key={step.title}
                delay={i * 120}
                className="fx-pop relative rounded-2xl border border-line bg-deep/50 p-8"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 font-display text-sm font-bold text-accent tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 text-fluid-xl font-bold text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed break-keep text-white/60 sm:text-base">
                  {step.body}
                </p>
                {i < lp.solution.cycle.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute top-1/2 -right-[0.95rem] z-10 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-abyss text-xs text-accent lg:flex"
                  >
                    →
                  </span>
                )}
              </Reveal>
            ))}
          </ol>
          <Reveal className="fx-title mt-10 flex items-center justify-center gap-3">
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="h-5 w-5 text-accent"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 12a8 8 0 1 1-2.34-5.66" />
              <path d="M20 4v5h-5" />
            </svg>
            <p className="text-sm font-bold text-white/70 sm:text-base">
              {lp.solution.loopBack}
            </p>
          </Reveal>
        </div>
      </section>

      {/* 1-8. CREW — "풀스택 개발자와 정규직 마케터가 끝까지 책임집니다".
          두 톤 제목 + 살짝 겹친 원 셋. 원 테두리는 한쪽에서 밝아지는
          그라데이션 고리(배경 그라데이션을 고리 모양으로 마스크)라 겹친
          자리에서도 서로의 선이 보인다. */}
      <section className={`overflow-hidden ${SECTION_Y}`}>
        <div className="page-container">
          <Reveal className="text-center">
            <h2 className="font-display text-[clamp(2rem,4.6vw,3.6rem)] leading-[1.25] font-bold tracking-tight break-keep whitespace-pre-line">
              {lp.crew.title.map(([text, strong]) => (
                <span
                  key={text}
                  className={strong ? "text-white" : "text-white/35"}
                >
                  {text}
                </span>
              ))}
            </h2>
          </Reveal>
          <ul className="mt-16 flex flex-col items-center sm:mt-20 lg:flex-row lg:justify-center">
            {lp.crew.items.map((item, i) => (
              <Reveal
                as="li"
                key={item.title}
                delay={i * 150}
                className={`relative flex aspect-square w-[min(84vw,340px)] flex-col items-center justify-center px-10 text-center lg:w-[min(31vw,380px)] ${
                  i > 0 ? "-mt-10 lg:mt-0 lg:-ml-10" : ""
                }`}
              >
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full [mask:radial-gradient(farthest-side,transparent_calc(100%-2px),#000_calc(100%-1.5px))]"
                  style={{
                    background: `linear-gradient(${[200, 160, 20][i]}deg, rgb(255 255 255 / 0) 25%, var(--color-accent) 70%, rgb(255 255 255 / 0.9))`,
                  }}
                />
                <span className="text-accent">
                  <CrewIcon name={item.icon} />
                </span>
                <h3 className="mt-5 text-fluid-xl font-bold text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed break-keep text-white/60 sm:text-base">
                  <Lines text={item.body} />
                </p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 13. APPLY */}
      <section
        id="apply"
        className={`relative scroll-mt-4 overflow-hidden ${SECTION_Y}`}
      >
        <div aria-hidden className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_0%,#1e3352_0%,transparent_70%)]" />
        </div>
        {/* 가운데 한 단 — 위 섹션들처럼 가운데 제목, 그 아래 혜택 칩 한 줄,
            그 아래 폭을 좁힌 폼 카드. 넓은 화면에서도 가로로 퍼지지 않는다. */}
        <div className="page-container relative">
          <Reveal className="fx-title text-center">
            <h2 className="font-display text-[clamp(2rem,4.6vw,3.6rem)] leading-[1.25] font-bold tracking-tight break-keep text-white">
              <Lines text={lp.apply.title} />
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-fluid-base leading-relaxed break-keep text-white/60">
              {lp.apply.body}
            </p>
            <ul className="mt-8 flex flex-wrap justify-center gap-2.5">
              {lp.hero.badges.map((badge) => (
                <li
                  key={badge}
                  className="flex items-center gap-2 rounded-full border border-line bg-deep/50 py-1.5 pr-4 pl-2 text-sm font-medium text-white/80"
                >
                  <Check />
                  {badge}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal
            delay={100}
            className="fx-pop mx-auto mt-12 max-w-xl rounded-[1.75rem] border border-line bg-deep/60 p-6 shadow-[0_24px_60px_rgb(0_0_0/0.35)] sm:mt-14 sm:p-10"
          >
            <LandingForm inquiryType={lp.inquiryType} />
          </Reveal>
        </div>
      </section>

      {/* 사업자 정보 — 광고 랜딩에도 표시 의무가 있는 줄만 남긴다. */}
      <footer className="py-10 text-xs leading-relaxed text-white/40">
        <div className="page-container">
          <p className="font-bold text-white/60">{company.name}</p>
          <p className="mt-2">
            대표자 {company.ceo} | 사업자등록번호 {company.bizNumber}
          </p>
          <p>
            {company.address} | {company.email}
          </p>
          <p className="mt-4">© {company.nameEn}. All rights reserved.</p>
        </div>
      </footer>

      {/* 하단 고정 알림 바 — 오늘 방문/문의 수 + 신청 버튼.
          위 main 의 pb 가 바의 높이만큼 바닥을 비워 둬서 마지막 줄이
          가려지지 않는다. */}
      <LiveStatsBar path={lp.path} cta={lp.hero.cta} />
    </main>
  );
}
