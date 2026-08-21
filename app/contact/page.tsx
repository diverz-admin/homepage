import type { Metadata } from "next";
import ContactForm from "@/components/contact-form";
import Bubbles from "@/components/bubbles";
import Reveal from "@/components/reveal";
import { company } from "@/lib/site";

export const metadata: Metadata = {
  title: "CONTACT",
  description:
    "문의 내용에 따라 전담 매니저가 무료로 맞춤형 컨설팅을 제공합니다. 다이버즈에 프로젝트를 문의하세요.",
};

/**
 * 레퍼런스대로 히어로 없이 통짜 다크 섹션 하나로 짠다.
 * 좌 — 큰 헤드라인 + 연락처(하단 정렬), 우 — 밑줄 스타일 간편 문의 폼.
 * 헤더가 fixed(h-20)라 pt로 상단 여백을 직접 잡아야 한다.
 */
export default function ContactPage() {
  return (
    <section className="relative overflow-hidden bg-abyss pt-40 pb-24 sm:pt-48 sm:pb-32">
      {/* 배경 영상. 소리 없는 장식용 루프라 muted+autoPlay+loop.
          폼 글자 대비를 지켜야 해서 어둡게 두 겹(단색+세로 그라디언트)을
          덮고, 위아래 끝만 짧게 풀어 섹션 경계에서 뚝 끊겨 보이지 않게 한다. */}
      <div aria-hidden className="absolute inset-0">
        <video
          src="/videos/contact.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-abyss/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-abyss via-transparent to-abyss" />
      </div>

      <Bubbles />
      <div className="page-container relative grid gap-16 lg:grid-cols-2 lg:gap-24">
        <Reveal>
          <div className="flex h-full flex-col justify-between gap-16">
            <h1 className="text-balance break-keep font-display text-fluid-2xl leading-[1.05] font-bold tracking-tight text-white">
              다이버즈와의 파트너십은
              <br />
              <span className="text-white/40">성장</span>과{" "}
              <span className="text-white/40">도약</span>을 위한
              <br />
              기회입니다.
            </h1>

            <dl className="space-y-2 text-sm">
              <div className="flex gap-3">
                <dt className="font-bold text-white">E.</dt>
                <dd>
                  <a
                    href={`mailto:${company.email}`}
                    className="text-white/70 transition-colors hover:text-accent-soft"
                  >
                    {company.email}
                  </a>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="font-bold text-white">A.</dt>
                <dd className="text-white/70">{company.address}</dd>
              </div>
            </dl>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
