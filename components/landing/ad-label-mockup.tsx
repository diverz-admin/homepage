import Reveal from "@/components/reveal";

/**
 * 광고 표시 비교 그림 — 쇼핑 검색 결과 화면 위에 "광고 상품"과
 * "광고 표시 없음" 자리를 짚어 보이는 개념 그림.
 *
 * 받은 레퍼런스(실제 쇼핑 검색 캡처 + 초록 강조)를 다이버즈 톤으로 다시
 * 그렸다. 특정 플랫폼 로고/화면은 쓰지 않고 상품은 뼈대(회색 블록)로만
 * 그린다. 강조는 초록 대신 accent. 강조 칸 아래로 세로선이 그어지며
 * 맺음 문구(caption)로 이어진다.
 */

type Slot = { ad?: "광고" | "광고+"; pointer?: boolean; highlight?: boolean };

/** 2열 x 3줄. 위 두 줄은 광고, 셋째 줄 왼쪽이 광고 표시 없는 상단 상품. */
const SLOTS: Slot[] = [
  { ad: "광고" },
  {},
  { ad: "광고", pointer: true },
  { ad: "광고+" },
  { highlight: true },
  {},
];

function Product({
  slot,
  adLabel,
  cleanLabel,
}: {
  slot: Slot;
  adLabel: string;
  cleanLabel: string;
}) {
  return (
    <div
      className={`relative rounded-xl p-2.5 transition sm:p-3.5 ${
        slot.highlight
          ? "z-10 border-2 border-accent bg-accent/10"
          : "border border-transparent"
      }`}
    >
      {slot.highlight && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-[0.65rem] font-bold whitespace-nowrap text-abyss sm:-top-3.5 sm:text-xs">
          {cleanLabel}
        </span>
      )}
      {/* 상품 내용은 흐리게 — 읽히는 건 표시(배지)뿐이어야 한다. */}
      <div aria-hidden className="flex gap-2.5 blur-[1.5px] sm:gap-3">
        <span
          className={`block aspect-square w-[38%] shrink-0 rounded-md ${slot.highlight ? "bg-white/25" : "bg-white/12"}`}
        />
        <div className="flex flex-1 flex-col gap-1.5 pt-0.5">
          <span className="block h-1.5 w-11/12 rounded-full bg-white/25 sm:h-2" />
          <span className="block h-1.5 w-3/4 rounded-full bg-white/15 sm:h-2" />
          <span className="block h-1.5 w-1/2 rounded-full bg-accent/40 sm:h-2" />
          <span className="mt-1 block h-1.5 w-2/3 rounded-full bg-white/10 sm:h-2" />
          <span className="block h-1.5 w-1/3 rounded-full bg-white/10 sm:h-2" />
        </div>
      </div>
      {slot.ad && (
        <span className="absolute right-2.5 bottom-2.5 rounded border border-white/35 px-1.5 py-px text-[0.6rem] font-bold text-white/70 sm:right-3.5 sm:bottom-3.5 sm:text-[0.7rem]">
          {slot.ad}
        </span>
      )}
      {slot.pointer && (
        // 넓은 화면에서는 배지 옆에 "← 광고 상품" 짚는 표시.
        <span className="absolute right-[-0.5rem] bottom-2 z-20 hidden translate-x-full items-center gap-1.5 rounded bg-[#0f1a2b] px-1.5 text-xs font-bold whitespace-nowrap text-white/80 sm:bottom-3 sm:flex">
          <span aria-hidden>←</span>
          {adLabel}
        </span>
      )}
    </div>
  );
}

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
        <div className="rounded-[1.6rem] border border-white/15 bg-[#0f1a2b] p-3 shadow-[0_24px_60px_rgb(0_0_0/0.45)] sm:p-4">
          {/* 검색창 — 특정 플랫폼 로고 대신 비어 있는 자리 표시 */}
          <div className="flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.05] px-4 py-2.5">
            <span
              aria-hidden
              className="block h-4 w-4 rounded-md bg-accent/70"
            />
            <span className="block h-2 w-24 rounded-full bg-white/15" />
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="ml-auto h-4 w-4 text-accent"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4 4" />
            </svg>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-x-2 gap-y-4 sm:gap-x-3">
            {SLOTS.map((slot, i) => (
              <div
                key={i}
                className={i < 4 ? "border-b border-white/[0.07] pb-3" : ""}
              >
                <Product
                  slot={slot}
                  adLabel={adLabel}
                  cleanLabel={cleanLabel}
                />
              </div>
            ))}
          </div>
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
