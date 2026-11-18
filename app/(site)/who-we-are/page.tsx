import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import GradientLine from "@/components/gradient-line";
import PageHero from "@/components/page-hero";
import Reveal from "@/components/reveal";
import HoverRevealCards from "@/components/ui/cards";
import { process, team } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  path: "/who-we-are",
  title: "WHO WE ARE",
  description:
    "다이버즈는 브랜드의 본질을 탐색하고, 전략과 실행으로 성장을 함께 만들어내는 IMC 마케팅 파트너입니다.",
});

/**
 * 5단계 프로세스의 "수심". 내려갔다(01→03) 떠오르는(04→05) 여정을
 * 눈에 보이게 만드는 장치라 데이터가 아닌 표현으로 보고 여기에 둔다.
 * depth는 타임라인 왼쪽 라벨, rising은 상승 구간의 강조 여부.
 */
const journey = [
  { depth: "-15m", rising: false },
  { depth: "-40m", rising: false },
  { depth: "-60m", rising: false },
  { depth: "-25m", rising: true },
  { depth: "0m", rising: true },
] as const;

/**
 * HOW WE WORK 배경 잠수 영상.
 *
 * 사각형 사진이 아니라 섹션의 배경이어야 한다. 그래서
 *  - 컨테이너를 벗어나 뷰포트 왼쪽 끝까지 붙고(full-bleed),
 *  - 섹션 높이를 위아래로 꽉 채워 잘린 띠처럼 보이지 않게 하고,
 *  - 오른쪽 한 방향으로만 길게 배경색에 녹아든다.
 *
 * 위아래로도 페이드를 주면 "가운데 떠 있는 사진"이 되어버리므로 주지 않는다.
 * mask-image 대신 배경색(abyss) 오버레이를 쓰는 이유는, body에 고정
 * 그라디언트가 깔려 있어 투명하게 뚫으면 뒤가 비쳐 톤이 어긋나기 때문이다.
 *
 * lg 미만에서는 카드가 사진 위에 올라타므로 스크림을 훨씬 진하게 깐다.
 */
function DiverBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-0 w-full lg:w-[56%]"
    >
      {/*
        높이를 화면 높이(최대 860px)로 묶고 sticky로 따라오게 한다.
        object-cover의 확대율은 박스 높이가 결정하는데, 섹션 전체 높이
        (1656px)를 그대로 채우면 720p 소스가 2.3배로 늘어나 뭉개진다.
        860px면 약 1.2배라 원본 화질에 가깝고, sticky라 섹션을 지나는 동안
        계속 배경에 남는다.
        (sticky는 overflow:hidden 조상 안에서 동작하지 않으므로 섹션에서
         overflow-hidden을 뺐다. 이 레이어는 섹션 밖으로 넘치지 않는다.)
      */}
      <div className="sticky top-0 h-[min(100vh,860px)] overflow-hidden">
        {/* 소리 없는 장식용 루프. poster는 영상 첫 프레임이라 로드 전에도
            같은 그림이 보인다. */}
        <video
          src="/videos/diving.mp4"
          poster="/videos/diving-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        {/* 전체를 한 겹 눌러 어둡게 깐다. */}
        <div className="absolute inset-0 bg-abyss/45" />
        {/* 오른쪽 한 방향 페이드 — 이게 주된 블렌딩이다. */}
        <div className="absolute inset-0 bg-gradient-to-r from-abyss/60 via-abyss/80 to-abyss lg:from-abyss/25 lg:via-abyss/60 lg:to-abyss" />
        {/* 위아래 끝 13%만 짧게 풀어 경계에서 영상이 뚝 끊겨 보이지 않게 한다. */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--ocean-abyss)_0%,transparent_13%,transparent_87%,var(--ocean-abyss)_100%)]" />
      </div>
    </div>
  );
}

export default function WhoWeArePage() {
  return (
    <>
      <PageHero
        title={
          <>
            <GradientLine>브랜드와 세상을 연결하는</GradientLine>
            <GradientLine>IMC 마케팅 파트너</GradientLine>
          </>
        }
        description={
          "다이버즈는 단순한 마케팅 대행사가 아닙니다.\n" +
          "브랜드의 본질을 탐색하고, 다이버즈만의 전략과 실행으로\n" +
          "성장을 함께 만들어내는 IMC 마케팅 파트너입니다."
        }
        center
        equalPadding
        titleReveal
        noBackdrop
      />

      {/* 5단계 프로세스 — 잠수부가 내려갔다 올라오는 여정 */}
      <section className="relative py-28 sm:py-40">
        <DiverBackdrop />
        <div className="relative page-container">
          {/* 타임라인과 같은 오른쪽 컬럼(배경 영상이 사라진 자리)에 둔다.
              전에는 이 블록만 왼쪽(영상 위)에 남아 있어서 아래 타임라인과
              떨어져 보였다 — lg부터 같은 ml로 맞춰 타임라인 바로 위에 온다. */}
          <div className="lg:ml-[38%] xl:ml-[34%]">
            <Reveal>
              <p className="font-display text-xs font-bold tracking-[0.35em] text-accent">
                HOW WE WORK
              </p>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="mt-5 text-balance break-keep font-display text-fluid-2xl font-bold tracking-tight">
                <GradientLine>우리 브랜드가 더 높게,</GradientLine>
                <GradientLine>더 빠르게 세상과 연결되도록.</GradientLine>
              </h2>
            </Reveal>
          </div>

          {/* 타임라인은 배경 영상이 다 사라진 오른쪽 영역에 놓는다.
              예전에는 좁은 컨테이너 탓에 음수 mr로 폭을 되찾았지만,
              page-container(최대 1498px)로 넓어진 뒤로는 필요 없다. */}
          <ol className="relative mt-16 space-y-6 sm:mt-20 sm:space-y-8 lg:ml-[38%] xl:ml-[34%]">
            {/* 하강-상승 라인. 가장 깊은 03에서 가장 진해진다. */}
            <div
              aria-hidden
              className="absolute top-6 bottom-6 left-1 w-px bg-gradient-to-b from-accent/15 via-accent/60 to-accent/25 sm:left-28"
            />

            {process.map((step, i) => {
              const { depth, rising } = journey[i];
              return (
                <Reveal as="li" key={step.no} delay={i * 90}>
                  <div className="relative pl-6 sm:pl-28">
                    {/* 수심 라벨 + 마커 */}
                    <span
                      aria-hidden
                      className="absolute top-6 left-0 hidden w-28 pr-8 text-right font-display text-[0.7rem] font-bold tracking-[0.1em] text-white/30 tabular-nums sm:block"
                    >
                      {depth}
                    </span>
                    <span
                      aria-hidden
                      className={`absolute top-[1.6rem] left-1 h-2.5 w-2.5 -translate-x-1/2 rounded-full ring-4 ring-abyss sm:left-28 ${
                        rising ? "bg-accent" : "bg-accent/45"
                      }`}
                    />

                    <div
                      className={`rounded-2xl border p-6 transition-colors sm:p-7 ${
                        rising
                          ? "border-accent/25 bg-gradient-to-r from-deep/55 to-abyss hover:border-accent/50"
                          : "border-line bg-deep/20 hover:border-accent/40"
                      }`}
                    >
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="font-display text-xs font-bold tracking-[0.2em] text-white/30">
                          {step.no}
                        </span>
                        <span aria-hidden className="text-white/15">
                          |
                        </span>
                        <h3 className="font-display text-fluid-xl font-bold tracking-tight text-accent">
                          {step.en}
                        </h3>
                      </div>
                      <p className="mt-2 text-base font-bold text-white">
                        {step.title}
                      </p>
                      <p className="mt-1.5 max-w-2xl text-fluid-sm text-muted">
                        {step.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </section>

      {/* 팀 — 화이트 섹션. 카드 행은 컨테이너를 벗어나 가로로 흐르고,
          좁은 화면에서는 그대로 스크롤된다(시안처럼 양옆이 잘려 보인다). */}
      <section className="bg-white py-28 sm:py-36">
        <div className="page-container text-center">
          <Reveal>
            <p className="font-display text-xs font-bold tracking-[0.35em] text-mid">
              WE ARE DIVERZ
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-5 text-balance break-keep font-display text-fluid-2xl font-bold tracking-tight text-abyss">
              최고의 전문가들이 <span className="text-mid">함께합니다</span>
            </h2>
          </Reveal>
        </div>

        {/* HoverRevealCards — 한 장에 마우스를 올리면 그 카드만 또렷해지고
            나머지는 흐려진다. 6명이라 3열 2행으로 떨어뜨렸다.
            컴포넌트 기본값(max-w-6xl, 4열, p-4)은 이 페이지의 page-container
            폭과 맞지 않아 className으로 덮는다. */}
        <Reveal delay={150}>
          <div className="page-container mt-14 sm:mt-16">
            <HoverRevealCards
              items={team.map((member) => ({
                id: member.role,
                title: member.role,
                subtitle: member.short,
                imageUrl: member.image,
                description: member.body,
              }))}
              className="mx-auto max-w-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 md:grid-cols-3 lg:gap-6"
              cardClassName="h-72 sm:h-80"
            />
          </div>
        </Reveal>
      </section>

    </>
  );
}
