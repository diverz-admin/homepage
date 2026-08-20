import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/hero";
import Reveal from "@/components/reveal";
import GrowthStats from "@/components/growth-stats";
import ClientLogos from "@/components/client-logos";
import InlineContactForm from "@/components/inline-contact-form";
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

      {/* 성과 수치 — 다크 섹션 */}
      <GrowthStats />

      {/* 케이스 — who-we-are에서 옮겨온 성과 사례. 성장 곡선 자체가
          결과를 증명하므로 GrowthStats의 추상적인 배경 그래프 대신 이
          자리에 둔다. */}
      <section className="bg-[linear-gradient(180deg,var(--ocean-abyss)_0%,var(--ocean-deep)_100%)] py-28 sm:py-40">
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
                              row.lead ? "border-accent/25" : "border-line"
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

      {/* 함께한 클라이언트 로고 월 */}
      <ClientLogos />

      {/* CTA — 왼쪽에 카피와 연락처, 오른쪽에 간편 문의 폼 */}
      <section className="relative overflow-hidden pb-40 pt-20 sm:pb-52 sm:pt-28">
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
                문의 내용에 따라 전담 매니저가 무료로 맞춤형 컨설팅을 제공합니다.
                <br className="hidden sm:block" />
                기본 상담부터 비즈니스 성장을 위한 실질적인 인사이트까지 함께
                만나보세요.
              </p>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <InlineContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
