"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import CountUp from "@/components/count-up";
import { ButtonColorful } from "@/components/ui/button-colorful";
import { stats } from "@/lib/site";

/**
 * 성과 수치 섹션 — 배경에 우상향 라인/영역 그래프를 깔고,
 * 스크롤 진입 시 좌→우로 그려지며 라인이 상승하는 애니메이션을 준다.
 */

// SVG 좌표계 (y는 아래로 증가). BASE가 바닥(0 수준), 위로 갈수록 값이 커진다.
const BASE = 420;
const POINTS: [number, number][] = [
  [0, 372],
  [125, 348],
  [250, 330],
  [375, 298],
  [500, 262],
  [625, 226],
  [750, 176],
  [875, 116],
  [1000, 44],
];

export default function GrowthStats() {
  const sectionRef = useRef<HTMLElement>(null);
  // 0 = 아직 안 올라옴, 1 = 완전히 올라옴. 스크롤 위치가 그대로 진행도가 된다.
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let frame = 0;
    const measure = () => {
      frame = 0;
      // 모션 최소화 설정에서는 최종 상태로 고정한다.
      if (reduce) {
        setProgress(1);
        return;
      }
      const vh = window.innerHeight;
      const top = el.getBoundingClientRect().top;
      // 섹션 상단이 화면 바닥에 닿으면 0, 화면 맨 위까지 올라오면 1.
      // 즉 한 화면 높이만큼 스크롤하는 동안 그래프가 다 그려진다.
      const p = (vh - top) / vh;
      setProgress(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    onScroll();
    if (reduce) return () => cancelAnimationFrame(frame);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const linePoints = POINTS.map((p) => p.join(",")).join(" ");
  const areaPath =
    `M ${POINTS[0][0]},${BASE} ` +
    POINTS.map((p) => `L ${p[0]},${p[1]}`).join(" ") +
    ` L ${POINTS[POINTS.length - 1][0]},${BASE} Z`;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[660px] overflow-hidden bg-[linear-gradient(180deg,var(--ocean-deep)_0%,var(--ocean-abyss)_100%)] py-44 sm:min-h-[780px] sm:py-56"
    >
      {/* 배경 상승 그래프 — 스크롤 진행도에 맞춰 왼쪽부터 그려지며 올라온다. */}
      <div
        className="growth-chart pointer-events-none absolute inset-0"
        style={{
          clipPath: `inset(0 ${((1 - progress) * 100).toFixed(2)}% 0 0)`,
          transform: `translateY(${((1 - progress) * 14).toFixed(2)}%)`,
        }}
      >
        <svg
          viewBox={`0 0 1000 ${BASE}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient id="growth-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.5" />
              <stop offset="55%" stopColor="var(--ocean-mid)" stopOpacity="0.16" />
              <stop offset="100%" stopColor="var(--ocean-abyss)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#growth-fill)" />
          <polyline
            points={linePoints}
            fill="none"
            stroke="#5cc6ff"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* 데이터 포인트 + 세로 점선 — 원형/두께 유지를 위해 HTML 오버레이로 처리 */}
        <div className="absolute inset-0">
          {POINTS.map(([x, y], i) => {
            const left = (x / 1000) * 100;
            const top = (y / BASE) * 100;
            return (
              <div key={i}>
                <div
                  className="absolute w-px bg-[repeating-linear-gradient(180deg,rgba(125,211,252,0.35)_0_4px,transparent_4px_9px)]"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    height: `${100 - top}%`,
                  }}
                />
                <div
                  className="growth-dot absolute h-3 w-3 rounded-full bg-accent-soft shadow-[0_0_10px_rgb(124_156_196/0.7)] ring-2 ring-deep transition-transform duration-300 ease-out"
                  style={
                    {
                      left: `${left}%`,
                      top: `${top}%`,
                      // 선이 그 지점을 지나간 뒤에 점이 뜬다.
                      transform: `translate(-50%, -50%) scale(${
                        progress >= (x / 1000) * 0.96 ? 1 : 0
                      })`,
                    } as CSSProperties
                  }
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* 가독성 스크림.

          중간 스톱을 예전에는 rgb(5 8 16)로 직접 적어 뒀는데, 배경이 딥
          네이비로 바뀐 뒤로는 섹션 배경과 다른 검정이라 스크림 자리가
          띠처럼 드러났다. --ocean-abyss-rgb를 쓰면 배경색을 바꿔도 같이 따라온다.

          방향은 화면에 따라 다르다 —
          가로가 넉넉하면 글이 왼쪽, 그래프가 오른쪽이라 90deg로 왼쪽만 누르면
          되지만, 모바일에서는 글이 위 · 그래프가 아래로 쌓인다. 그때 90deg를
          그대로 쓰면 왼쪽 절반이 통째로 눌려 세로 배경 그라디언트와 엇갈리고
          왼쪽 위 모서리만 어두운 얼룩처럼 보인다. 그래서 좁은 화면에서는
          위에서 아래로 누른다. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,var(--ocean-abyss)_0%,rgb(var(--ocean-abyss-rgb)/0.8)_42%,transparent_84%)] sm:bg-[linear-gradient(90deg,var(--ocean-abyss)_0%,rgb(var(--ocean-abyss-rgb)/0.72)_34%,transparent_62%)]"
      />

      {/* 콘텐츠 */}
      <div className="relative z-10 page-container">
        {/* GradientLine은 줄마다 block을 씌우므로 쓰면 강제로 2줄이 된다.
            한 줄로 흘리고, 폭이 모자랄 때만 break-keep 규칙으로 접히게 둔다. */}
        <h2 className="text-balance break-keep font-display text-fluid-2xl font-bold tracking-tight">
          수치로 증명하는 결과 중심 마케팅
        </h2>

        <dl className="mt-12 grid max-w-md grid-cols-2 gap-x-10 gap-y-8">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="text-sm text-white/60">{stat.label}</dt>
              <dd className="mt-1 font-sans text-fluid-2xl font-semibold tracking-tight text-accent">
                <CountUp to={stat.value} suffix={stat.suffix} />
              </dd>
              <p className="mt-1 text-xs text-white/40">{stat.note}</p>
            </div>
          ))}
        </dl>

        <div className="mt-12">
          <ButtonColorful
            onClick={() => router.push("/work")}
            label="결과물 확인하기"
            className="h-12 px-6"
          />
        </div>
      </div>
    </section>
  );
}
