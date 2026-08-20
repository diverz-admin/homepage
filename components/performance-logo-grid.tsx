import { performanceChannels } from "@/lib/site";

/**
 * 퍼포먼스 마케팅 채널 로고 6개를 3열 x 2행으로 놓는다. (서비스 페이지
 * 퍼포먼스 블록, LogoOrbit의 정적 그리드 버전)
 *
 * 칩 스타일(흰 배경 원, 그림자, 링)은 LogoOrbit과 맞춘다 — 두 블록 다
 * 밝은 패널에서만 쓰여 색을 절대값(white/abyss)으로 고정해도 된다.
 */
export default function PerformanceLogoGrid() {
  return (
    <div className="grid w-fit grid-cols-3 gap-6">
      {performanceChannels.map((logo) => (
        <span
          key={logo.name}
          className="flex size-20 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_2px_12px_rgb(10_21_38/0.07)] ring-1 ring-abyss/10"
        >
          {/* 원본 비율을 그대로 살려야 해서 next/image 대신 img를 쓴다. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo.src}
            alt={logo.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain"
          />
        </span>
      ))}
    </div>
  );
}
