import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/hero";
import Reveal from "@/components/reveal";
import GradientTransition from "@/components/gradient-transition";
import GrowthStats from "@/components/growth-stats";
import ClientLogos from "@/components/client-logos";
import ContactForm from "@/components/contact-form";
import Bubbles from "@/components/bubbles";
import GradientLine from "@/components/gradient-line";
import ServiceStack from "@/components/service-stack";
import { TextRevealByWord } from "@/components/ui/text-reveal";
import { cases, company } from "@/lib/site";

export default function Home() {
  return (
    <>
      <Hero />

      {/* 히어로가 아래쪽에서 이미 abyss로 잠기며 끝나므로 사이 여백을 두지
          않는다. (예전 히어로는 흰 배경이라 다크 인트로 앞에 흰 여백이
          필요했다.) */}

      {/* LET'S DIVE — 하강 인트로 (스크롤에 따라 단어가 수면 위로 드러난다)
          sticky 리빌이 뷰포트에 고정돼야 하므로 섹션에는 overflow-hidden을 주지 않고,
          Bubbles만 별도 클립 래퍼로 가둔다. */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <Bubbles />
        </div>
        <TextRevealByWord
          text={company.intro}
          eyebrow={
            <p className="mb-10 font-display text-xs font-bold tracking-[0.35em] text-accent">
              LET&apos;S DIVE
            </p>
          }
        />
      </section>

      {/* 서비스 프리뷰 — 스크롤할수록 패널이 위로 쌓이며 넘어간다 */}
      <ServiceStack />

      {/* 흰 서비스 섹션 → 다크 섹션. 경계를 선으로 두지 않고 그라디언트로
          잇는다. 스크롤에 따라 파랑이 차오른다(gradient-transition.tsx). */}
      <GradientTransition />

      {/* 성과 수치 — 다크 섹션 */}
      <GrowthStats />

      {/* 케이스 — who-we-are에서 옮겨온 성과 사례. 성장 곡선 자체가
          결과를 증명하므로 GrowthStats의 추상적인 배경 그래프 대신 이
          자리에 둔다. */}
      <section className="bg-[linear-gradient(180deg,var(--ocean-abyss)_0%,var(--ocean-deep)_100%)] pt-16 pb-24 sm:pt-20 sm:pb-32">
        <div className="page-container">
          <Reveal>
            <h2 className="max-w-2xl text-balance break-keep font-display text-fluid-2xl font-bold tracking-tight">
              <GradientLine>단기 성과부터 장기 성장까지,</GradientLine>
              <GradientLine gradient="from-accent-soft to-accent">
                모두 증명합니다
              </GradientLine>
            </h2>
          </Reveal>

          {/* 두 케이스를 좌우로 나란히 둔다. 위아래로 쌓으면 한 케이스를 보는
              동안 다른 케이스가 화면 밖에 있어서 "둘 다 증명한다"는 이 섹션의
              주장이 한 번에 전달되지 않는다.

              카드 안은 세로 한 줄(라벨 → 제목 → 그래프 → 문제/전략/결과 → 지표).
              좌우로 좁아진 만큼 그래프 높이를 220px로 물려 두 카드가 한 화면에
              들어오게 한다. lg 미만에서는 예전처럼 위아래로 쌓인다. */}
          <ul className="mt-12 grid gap-16 sm:mt-14 lg:grid-cols-2 lg:gap-12 xl:gap-20">
            {cases.map((item, i) => (
              <Reveal as="li" key={item.client} delay={i * 100}>
                {/* h-full + flex — 두 카드의 제목/본문 길이가 달라도 지표 줄이
                    바닥에 맞춰 나란히 선다(지표에 mt-auto). */}
                <article className="flex h-full flex-col">
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

                  <div className="mt-8 flex flex-1 flex-col">
                    <div>
                      <p className="font-display text-fluid-sm font-bold text-accent">
                        {item.client}
                      </p>
                      {/* min-h 2줄 — 제목이 한 줄인 케이스와 두 줄인 케이스가
                          섞여도 아래 그래프가 같은 높이에서 시작한다. */}
                      <h3 className="mt-3 text-balance break-keep font-display text-fluid-xl font-bold tracking-tight text-white lg:min-h-[2.4em]">
                        {item.headline}
                      </h3>
                    </div>

                    {/* 그래프는 장식이라 스크린리더에서 제외한다. 위아래 글이 같은
                        내용을 이미 전달한다. 뒤에 옅은 광원을 깔아 평평한
                        배경 위에 그래프만 떠 있는 느낌을 없앤다.
                        광원은 세로로만 번지게 한다 — 가로로 넓히면 컨테이너
                        바깥 여백(모바일 24px)을 넘어 페이지에 가로 스크롤이 생긴다.

                        고정 비율 상자에 담는다. 예전에는 max-h 로 높이만 물렸는데,
                        그러면 object-contain 이 그림을 상자 한가운데로 축소해
                        좌우에 빈 띠가 남았다 — 그래프가 단 위에 떠 있는 것처럼
                        보이던 원인이다. 지금은 여백을 잘라낸 -trim 이미지를
                        같은 비율 상자에 꽉 채워, 두 카드의 그래프가 같은 크기·
                        같은 높이에서 시작한다. */}
                    <div className="relative mt-7 aspect-[1280/784]">
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 -inset-y-10 bg-[radial-gradient(circle_at_58%_45%,rgb(124_156_196/0.12),transparent_62%)] blur-3xl"
                      />
                      {/* 그래프는 옛 팔레트(비비드 시안)로 구워진 PNG라
                          새 톤에서 혼자 튄다. 원본을 다시 뽑기 전까지
                          채도만 눌러 맞춘다. */}
                      <Image
                        src={item.graph}
                        alt=""
                        aria-hidden
                        fill
                        sizes="(min-width: 1024px) 45vw, 100vw"
                        className="graph-tone object-contain"
                      />
                    </div>

                    {/* 문제 → 전략 → 결과.
                        라벨을 좁은 단에 고정해 글머리를 맞추고, 줄 사이는
                        divide-y 로만 가른다. 예전에는 줄마다 border-b 를 달고
                        결과 줄만 다른 색을 줬는데, 굵기가 제각각인 선이 세 개
                        겹쳐 표처럼 보였다. 선은 한 종류만 두고, 결과는 글자색
                        으로만 띄운다. */}
                    <dl className="mt-9 divide-y divide-line border-b border-line">
                      {[
                        { label: "문제", text: item.problem },
                        { label: "전략", text: item.strategy },
                        { label: "결과", text: item.result, lead: true },
                      ].map((row) => (
                        <div
                          key={row.label}
                          className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-5 py-4"
                        >
                          <dt className="font-display text-fluid-sm font-bold tracking-tight text-accent">
                            {row.label}
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

                    {/* 이 섹션의 결론은 결국 숫자다. 잡지의 팩트 박스처럼
                        세 칸으로 균등하게 나누고 사이를 세로 실선으로 가른다.
                        wrap 으로 흘리던 예전 방식은 값 길이에 따라 칸 간격이
                        달라져 두 카드가 서로 어긋나 보였다.

                        mt-auto — 두 카드의 본문 길이가 달라도 지표 줄은
                        같은 높이에 선다. */}
                    <dl className="mt-auto grid grid-cols-3 pt-8">
                      {item.metrics.map((metric, mi) => (
                        <div
                          key={metric.label}
                          className={
                            mi === 0 ? "pr-4" : "border-l border-line pr-4 pl-5"
                          }
                        >
                          <dd className="font-display text-fluid-2xl font-semibold tracking-tight text-accent">
                            {metric.value}
                          </dd>
                          <dt className="mt-1.5 text-sm text-muted">
                            {metric.label}
                          </dt>
                        </div>
                      ))}
                    </dl>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={200}>
            <div className="mt-14 text-right">
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

      {/* 함께한 클라이언트 로고 월 */}
      <ClientLogos />

      {/* CTA — 왼쪽에 카피와 연락처, 오른쪽에 간편 문의 폼 */}
      <section className="relative overflow-hidden pb-16 pt-20 sm:pb-24 sm:pt-28">
        <Bubbles />
        <div className="page-container relative grid gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <h2 className="font-display text-fluid-2xl font-bold tracking-tight">
                <GradientLine>DIVE DEEP,</GradientLine>
                <GradientLine>RISE FAST</GradientLine>
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-8 text-fluid-base text-muted">
                문의 내용에 따라 전담 매니저가 무료로 맞춤형 컨설팅을
                제공합니다.
                <br className="hidden sm:block" />
                기본 상담부터 비즈니스 성장을 위한 실질적인 인사이트까지 함께
                만나보세요.
              </p>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
