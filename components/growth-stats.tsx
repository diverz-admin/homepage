"use client";

import { useRouter } from "next/navigation";
import CountUp from "@/components/count-up";
import Reveal from "@/components/reveal";
import { ButtonColorful } from "@/components/ui/button-colorful";
import { stats } from "@/lib/site";

/**
 * 성과 수치 섹션.
 *
 * 수치는 가로 3열이 아니라 오른쪽 단에 위에서 아래로 쌓는다. 제목·CTA는
 * 왼쪽에 두고, 왼쪽 단은 스크롤 동안 붙여 둬서(lg:sticky) 오른쪽 수치가
 * 하나씩 내려오는 동안 제목이 화면에 남아 있게 한다 — 섹션 전체가
 * "내려간다"는 브랜드 동선과 같은 방향으로 읽힌다.
 */
export default function GrowthStats() {
  const router = useRouter();

  return (
    <section className="relative bg-[linear-gradient(180deg,var(--ocean-deep)_0%,var(--ocean-abyss)_100%)] py-32 sm:py-44">
      {/* 배경 장식은 별도 클립 래퍼에 가둔다. 섹션에 overflow-hidden을 주면
          섹션이 스크롤 컨테이너가 돼서 왼쪽 단의 sticky가 통째로 죽는다. */}
      <div
        aria-hidden
        className="god-rays pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* 수치 단 뒤에 옅은 광원을 깔아 평평한 그라디언트 위에 층을 하나 만든다. */}
        <div className="absolute inset-y-0 right-0 w-[60%] bg-[radial-gradient(60%_50%_at_70%_50%,rgb(124_156_196/0.13),transparent_70%)] blur-3xl" />
      </div>

      <div className="relative z-10 page-container">
        {/* 섹션 라벨 + 헤어라인 — 페이지의 CASE 01 표기와 같은 언어. */}
        <Reveal>
          <div className="flex items-center gap-5">
            <span className="font-display text-xs font-bold tracking-[0.3em] text-accent">
              WHY DIVERZ
            </span>
            <span
              aria-hidden
              className="h-px flex-1 bg-gradient-to-r from-accent/40 to-transparent"
            />
          </div>
        </Reveal>

        <div className="mt-14 grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,38rem)] lg:gap-20">
          {/* 왼쪽 — 제목과 CTA. 오른쪽 수치가 내려오는 동안 화면에 머문다. */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              {/* GradientLine은 줄마다 block을 씌우므로 쓰면 강제로 2줄이 된다.
                  한 줄로 흘리고, 폭이 모자랄 때만 break-keep 규칙으로 접히게 둔다. */}
              <h2 className="text-balance break-keep font-display text-fluid-2xl font-bold tracking-tight">
                다이버즈와 함께해야 하는 이유
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <div className="mt-10">
                <ButtonColorful
                  onClick={() => router.push("/work")}
                  label="결과물 확인하기"
                  className="h-12 px-6"
                />
              </div>
            </Reveal>
          </div>

          {/* 오른쪽 — 수치가 위에서 아래로 하나씩 내려온다.
              셀마다 위 헤어라인을 두고 왼쪽 끝 짧은 구간만 액센트로 남겨,
              세로로 줄이 서되 표처럼 딱딱해 보이지 않게 한다. */}
          <dl className="flex flex-col gap-14 sm:gap-16">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 140}>
                <div className="relative pt-8">
                  <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-line" />
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 h-px w-14 bg-gradient-to-r from-accent to-accent/0"
                  />

                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-[0.7rem] font-bold tracking-[0.25em] text-accent/70">
                      0{i + 1}
                    </span>
                    <dt className="text-sm text-white/60">{stat.label}</dt>
                  </div>

                  {/* tabular-nums — 카운트업 중 자릿수 폭이 흔들리지 않게 한다. */}
                  <dd className="mt-3 font-sans text-fluid-3xl font-semibold tabular-nums tracking-tight text-accent">
                    <CountUp to={stat.value} suffix={stat.suffix} />
                  </dd>
                  <p className="mt-3 text-xs text-white/40">{stat.note}</p>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
