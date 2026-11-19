import Image from "next/image";
import Reveal from "@/components/reveal";
import searchShot from "@/public/images/landing/ad-search.png";

/**
 * 광고 표시 비교 그림 — 실제 쇼핑 검색 결과 캡처를 흐리게 깔고, 그 위에
 * "광고" 배지 자리와 "광고 표시 없음" 상품 자리를 짚어 보인다.
 *
 * 캡처는 상품/판매처가 읽히지 않을 만큼 블러 처리한다. 배지/강조 칸은
 * 캡처 위 실제 자리에 퍼센트 좌표로 얹는다(캡처 710x841 기준). 강조는
 * accent. 강조 칸 아래로 세로선이 그어지며 맺음 문구(caption)로 이어진다.
 */

/** 캡처 위 광고 배지 자리 — [left%, top%, 문구, 짚는 표시 여부] */
const BADGES: [number, number, string, boolean][] = [
  [38.6, 25.3, "광고", false],
  [38.6, 59.9, "광고", true],
  [87.4, 57, "광고+", false],
];

export default function AdLabelMockup({
  adLabel,
  cleanLabel,
  caption,
}: {
  adLabel: string;
  cleanLabel: string;
  caption: string;
}) {
  return (
    <figure className="mx-auto flex w-full max-w-[540px] flex-col items-center">
      <Reveal className="w-full">
        <div className="relative overflow-hidden rounded-[1.6rem] border border-white/15 bg-white shadow-[0_24px_60px_rgb(0_0_0/0.45)]">
          <Image
            src={searchShot}
            alt=""
            aria-hidden
            sizes="(min-width: 640px) 540px, 100vw"
            className="h-auto w-full scale-[1.06] blur-[8px] brightness-[0.8] saturate-[0.6]"
          />
          {/* 네이버 로고 자리만 또렷하게 — 같은 캡처를 블러 없이 로고 칸만
              잘라 얹는다(clip-path, 710x841 기준 x 37~63 / y 35~61). */}
          <Image
            src={searchShot}
            alt=""
            aria-hidden
            sizes="(min-width: 640px) 540px, 100vw"
            className="absolute inset-0 h-full w-full brightness-[0.8] [clip-path:inset(4.2%_91.1%_92.8%_5.2%_round_3px)]"
          />
          {BADGES.map(([left, top, label, pointer]) => (
            <span
              key={`${left}-${top}`}
              className="absolute flex items-center"
              style={{ left: `${left}%`, top: `${top}%` }}
            >
              <span className="rounded border border-[#8a93a3] bg-white px-1.5 py-px whitespace-nowrap text-[0.6rem] font-bold text-[#4b5563] shadow-sm sm:text-[0.7rem]">
                {label}
              </span>
              {pointer && (
                <span className="ml-1.5 hidden items-center gap-1 rounded bg-[#0f1a2b] px-1.5 py-0.5 text-xs font-bold whitespace-nowrap text-white sm:flex">
                  <span aria-hidden>←</span>
                  {adLabel}
                </span>
              )}
            </span>
          ))}
          {/* 광고 표시 없는 상단 상품 — 셋째 줄 왼쪽 */}
          <span className="absolute top-[66%] left-[3.5%] h-[26.5%] w-[46.5%] rounded-xl border-2 border-accent bg-accent/15 shadow-[0_0_0_9999px_rgb(9_17_30/0.25)]">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-[0.65rem] font-bold whitespace-nowrap text-abyss sm:-top-3.5 sm:text-xs">
              {cleanLabel}
            </span>
          </span>
        </div>
      </Reveal>

      {/* 강조 칸(왼쪽 셋째 줄) 가운데(전체 폭의 1/4 지점)에서 선이 내려오고,
          맺음 문구가 선이 닿은 자리에서 시작한다. */}
      <Reveal delay={300} className="w-full pl-[25%]">
        <span
          aria-hidden
          className="draw-line block h-20 w-px bg-accent/70 sm:h-28"
        />
      </Reveal>
      <Reveal delay={500} className="w-full pl-[25%]">
        <figcaption className="-ml-1 flex items-start gap-3 font-display text-fluid-xl leading-snug font-bold break-keep text-white">
          <span
            aria-hidden
            className="mt-[0.55em] block h-2 w-2 shrink-0 rounded-full bg-accent"
          />
          <span className="whitespace-pre-line">{caption}</span>
        </figcaption>
      </Reveal>
    </figure>
  );
}
