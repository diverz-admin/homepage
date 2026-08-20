import Hero from "@/components/hero";
import Reveal from "@/components/reveal";
import GrowthStats from "@/components/growth-stats";
import ClientLogos from "@/components/client-logos";
import InlineContactForm from "@/components/inline-contact-form";
import Bubbles from "@/components/bubbles";
import GradientLine from "@/components/gradient-line";
import ServiceStack from "@/components/service-stack";
import { TextRevealByWord } from "@/components/ui/text-reveal";
import { company } from "@/lib/site";

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
          footer={
            /* 개행은 좁은 화면에서만 살린다 — sm 이상은 한 줄에 들어가므로
               whitespace-normal로 되돌려 "\n"을 공백으로 흘린다. */
            <p className="mt-10 font-display text-fluid-lg font-bold whitespace-pre-line text-accent-soft sm:whitespace-normal">
              {company.positioning}
            </p>
          }
        />
      </section>

      {/* 서비스 프리뷰 — 스크롤할수록 패널이 위로 쌓이며 넘어간다 */}
      <ServiceStack />

      {/* 성과 수치 — 배경에 우상향 그래프가 그려지는 다크 섹션 */}
      <GrowthStats />

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
                문의 내용에 따라 전담 매니저가 맞춤형 컨설팅을 제공합니다.
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
