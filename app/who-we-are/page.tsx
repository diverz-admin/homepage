import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import GradientLine from "@/components/gradient-line";
import PageHero from "@/components/page-hero";
import Reveal from "@/components/reveal";
import HoverRevealCards from "@/components/ui/cards";
import { cases, process, strengths, team } from "@/lib/site";

export const metadata: Metadata = {
  title: "WHO WE ARE",
  description:
    "다이버즈는 단순한 마케팅 대행사가 아닙니다. 브랜드의 본질을 탐색하고, 가장 강력한 전략과 실행으로 전환과 성장을 동시에 만드는 IMC 마케팅 파트너입니다.",
};

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
          "브랜드의 본질을 탐색하고, 가장 강력한 전략과 실행으로\n" +
          "전환과 성장을 동시에 만드는 IMC 마케팅 파트너입니다."
        }
        center
        equalPadding
        titleReveal
      />

      {/* 5단계 프로세스 — 잠수부가 내려갔다 올라오는 여정 */}
      <section className="relative py-28 sm:py-40">
        <DiverBackdrop />
        <div className="relative page-container">
          <Reveal>
            <p className="font-display text-xs font-bold tracking-[0.35em] text-accent">
              HOW WE WORK
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-5 text-balance break-keep font-display text-fluid-2xl font-bold tracking-tight">
              <GradientLine>더 좋은 브랜드가 더 멀리,</GradientLine>
              <GradientLine>더 깊게 세상과 연결되도록.</GradientLine>
            </h2>
          </Reveal>

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

      {/* 강점 — 페이지에서 유일한 화이트 섹션.
          어두운 페이지 흐름을 한 번 끊어 성과 수치를 도드라지게 한다.
          이 안에서는 색 역할이 전부 뒤집히므로 흰 배경용 값을 직접 쓴다.
          accent는 흰 배경에서 대비가 모자라 mid를 쓴다. */}
      <section className="bg-white py-40 sm:py-56">
        <div className="page-container">
          <Reveal>
            {/* 흰 배경이지만 이 섹션은 .on-light가 아니라서 foreground가
                여전히 다크용 밝은 색이다. 글자색을 직접 줘야 한다. */}
            <h2 className="max-w-2xl text-balance break-keep font-display text-fluid-2xl font-bold tracking-tight text-abyss">
              <GradientLine>폭발적이며 지속 가능한</GradientLine>
              <GradientLine>브랜드 성장을 이루고 있습니다</GradientLine>
            </h2>
          </Reveal>

          <ul className="mt-16 grid gap-x-16 gap-y-4 sm:grid-cols-2">
            {strengths.map((item, i) => (
              <Reveal as="li" key={item.value} delay={i * 80} className="group">
                <div className="relative pt-7 pb-9">
                  {/* 기준선은 위로 올렸다. 아래 밑줄은 항목을 닫아버리지만,
                      위 선은 번호·라벨·값을 한 덩어리로 묶어준다.
                      짧은 액센트 구간이 호버 때 선 전체로 자라난다. */}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-px bg-abyss/12"
                  />
                  <span
                    aria-hidden
                    className="absolute top-0 left-0 h-px w-12 bg-mid transition-all duration-500 ease-out group-hover:w-full"
                  />

                  <div className="flex items-start gap-6">
                    {/* 페이지의 다른 번호 표기(01~05 프로세스)와 같은 언어를 쓴다. */}
                    <span
                      aria-hidden
                      className="font-display text-fluid-xl leading-none font-semibold text-abyss/15 tabular-nums transition-colors duration-300 group-hover:text-mid/70"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      {/* 라벨은 값을 받쳐주는 역할이라 한 단계 죽이고,
                          값은 이 섹션에서 실제로 읽혀야 하는 문장이라 키운다. */}
                      <p className="text-fluid-sm text-abyss/45">
                        {item.label}
                      </p>
                      <p className="mt-2.5 text-fluid-xl font-bold tracking-tight text-abyss">
                        {item.value}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 케이스 — 성장 그래프는 완전 투명 PNG이고 꼬리가 짙은 네이비를 알파로
          흐린 형태라, 어두운 배경에서 그대로 배경에 녹아든다. */}
      <section className="py-28 sm:py-40">
        <div className="page-container">
          <Reveal>
            <h2 className="max-w-2xl text-balance break-keep font-display text-fluid-2xl font-bold tracking-tight">
              <GradientLine>단기 성과부터 장기 성장까지,</GradientLine>
              <GradientLine gradient="from-accent-soft to-accent">
                모두 증명합니다
              </GradientLine>
            </h2>
          </Reveal>

          <ul className="mt-20 space-y-24 sm:mt-24 sm:space-y-32">
            {cases.map((item, i) => (
              <Reveal as="li" key={item.client} delay={i * 100}>
                <article>
                  {/* 케이스 번호 + 헤어라인. 페이지의 다른 번호 표기와 같은 언어. */}
                  <div className="flex items-center gap-5">
                    <span className="font-display text-xs font-bold tracking-[0.3em] text-accent">
                      CASE 0{i + 1}
                    </span>
                    <span
                      aria-hidden
                      className="h-px flex-1 bg-gradient-to-r from-accent/40 to-transparent"
                    />
                  </div>

                  <div className="mt-10 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* 짝수 케이스는 좌우를 뒤집어 두 블록이 같은 그림으로
                        반복되지 않게 한다. */}
                    <div className={i % 2 === 1 ? "lg:order-last" : undefined}>
                      <p className="font-display text-fluid-sm font-bold text-accent">
                        {item.client}
                      </p>
                      <h3 className="mt-3 text-balance break-keep font-display text-fluid-xl font-bold tracking-tight text-white">
                        {item.headline}
                      </h3>

                      {/* 문제 → 전략 → 결과. 라벨 폭을 고정해 글머리를 맞추고,
                          결과 줄만 액센트로 띄워 시선이 끝에 머물게 한다. */}
                      <dl className="mt-9">
                        {[
                          { label: "문제", text: item.problem },
                          { label: "전략", text: item.strategy },
                          { label: "결과", text: item.result, lead: true },
                        ].map((row) => (
                          <div
                            key={row.label}
                            className={`flex gap-4 border-b py-4 ${
                              row.lead
                                ? "border-accent/25"
                                : "border-line"
                            }`}
                          >
                            <dt className="flex w-14 shrink-0 items-baseline justify-between font-display text-fluid-sm font-bold text-accent">
                              <span>{row.label}</span>
                              <span aria-hidden className="text-white/20">
                                |
                              </span>
                            </dt>
                            <dd
                              className={`text-fluid-sm break-keep ${
                                row.lead
                                  ? "font-medium text-accent-soft"
                                  : "text-white/75"
                              }`}
                            >
                              {row.text}
                            </dd>
                          </div>
                        ))}
                      </dl>

                      {/* 이 섹션의 결론은 결국 숫자다. 가장 크게 둔다. */}
                      <dl className="mt-9 flex flex-wrap gap-x-12 gap-y-6">
                        {item.metrics.map((metric) => (
                          <div key={metric.label}>
                            <dd className="font-display text-fluid-xl font-semibold tracking-tight text-accent">
                              {metric.value}
                            </dd>
                            <dt className="mt-1 text-xs text-muted">
                              {metric.label}
                            </dt>
                          </div>
                        ))}
                      </dl>
                    </div>

                    {/* 그래프는 장식이라 스크린리더에서 제외한다. 왼쪽 글이 같은
                        내용을 이미 전달한다. 뒤에 옅은 광원을 깔아 평평한
                        배경 위에 그래프만 떠 있는 느낌을 없앤다.
                        광원은 세로로만 번지게 한다 — 가로로 넓히면 컨테이너
                        바깥 여백(모바일 24px)을 넘어 페이지에 가로 스크롤이 생긴다. */}
                    <div className="relative">
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 -inset-y-12 bg-[radial-gradient(circle_at_58%_45%,rgb(124_156_196/0.12),transparent_62%)] blur-3xl"
                      />
                      {/* 그래프는 옛 팔레트(비비드 시안)로 구워진 PNG라
                          새 톤에서 혼자 튄다. 원본을 다시 뽑기 전까지
                          채도만 눌러 맞춘다. */}
                      <Image
                        src={item.graph}
                        alt=""
                        aria-hidden
                        width={1280}
                        height={916}
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="graph-tone relative h-auto w-full"
                      />
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={200}>
            <div className="mt-20 text-center">
              <Link
                href="/work"
                className="inline-flex items-center gap-2 text-sm font-bold text-accent transition hover:text-accent-soft"
              >
                전체 성과 보기
                <span aria-hidden>→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 팀 — 화이트 섹션. 카드 행은 컨테이너를 벗어나 가로로 흐르고,
          좁은 화면에서는 그대로 스크롤된다(시안처럼 양옆이 잘려 보인다). */}
      <section className="bg-white py-52 sm:py-72">
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
          <div className="page-container mt-20 sm:mt-24">
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
