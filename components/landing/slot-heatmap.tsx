import Reveal from "@/components/reveal";

/**
 * 구좌별 반응 분포도 — 검색 결과 화면 두 개(네이버 쇼핑형 격자 / 쿠팡형
 * 2열) 위에 "위쪽일수록 반응이 몰린다"는 열지도를 덮은 개념 그림.
 *
 * 받은 레퍼런스(빨강~노랑 열지도 + 실제 쇼핑 앱 캡처)를 다이버즈 톤으로
 * 다시 그렸다. 화면 속 상품은 실제 캡처 대신 뼈대(회색 블록)로 그리고
 * 계속 아래로 스크롤되게 움직인다. 열지도는 사용자 요청으로 위 빨강 →
 * 아래 파랑(accent) 그라데이션이다(사이트에서 빨강을 쓰는 예외 자리). 수치가 없는
 * 개념 그림이라 설문/출처 같은 근거 문구는 붙이지 않는다.
 *
 * 화면에 들어오면 열지도가 위에서부터 차오른다.
 */

/** 상품 카드 뼈대 — 사진 칸 + 글줄 몇 개. */
function Card({ tall = false }: { tall?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className={`block rounded-md bg-white/12 ${tall ? "aspect-[4/5]" : "aspect-square"}`}
      />
      <span className="mt-0.5 block h-1.5 w-11/12 rounded-full bg-white/15" />
      <span className="block h-1.5 w-2/3 rounded-full bg-white/15" />
      <span className="block h-2 w-1/2 rounded-full bg-white/30" />
    </div>
  );
}

function Phone({
  label,
  variant,
  delay,
}: {
  label: string;
  variant: "grid" | "list";
  delay: number;
}) {
  return (
    <figure className="flex flex-col items-center">
      <div className="relative w-[128px] overflow-hidden rounded-[1.4rem] border border-white/15 bg-[#0f1a2b] shadow-[0_18px_50px_rgb(0_0_0/0.45)] sm:w-[190px] lg:w-[210px]">
        <div className="aspect-[9/17] p-2.5 sm:p-3">
          {/* 검색창 */}
          <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-1.5">
            <span className="block h-2 w-2 shrink-0 rounded-full border border-white/40" />
            <span className="text-[0.55rem] font-bold text-white/80 sm:text-[0.7rem]">
              이어폰
            </span>
          </div>
          {/* 필터 칩 */}
          <div className="mt-2 flex gap-1">
            {[10, 14, 12].map((w, i) => (
              <span
                key={i}
                className="block h-2.5 rounded-full bg-white/10 sm:h-3"
                style={{ width: `${w * 2}%` }}
              />
            ))}
          </div>
          {/* 상품 — 손가락으로 넘기듯 계속 아래로 스크롤된다. 같은 목록을
              두 벌 이어 붙이고 -50%까지 올려서 끊김 없이 돈다. 검색창과
              열지도는 그대로 두고 상품만 지나간다. */}
          <div className="relative mt-3 h-[calc(100%-4.5rem)] overflow-hidden sm:h-[calc(100%-5rem)]">
            <div className="slot-scroll grid grid-cols-2 gap-x-2 gap-y-3">
              {[0, 1].map((copy) =>
                (variant === "grid"
                  ? [false, false, false, false, false, false]
                  : [true, true, false, false, true, true]
                ).map((tall, i) => <Card key={`${copy}-${i}`} tall={tall} />),
              )}
            </div>
          </div>
        </div>

        {/* 열지도 — 위는 빨강(반응 매우 높음), 아래로 갈수록 파랑(낮음).
            화면에 들어오면 위에서부터 차오른다. */}
        <Reveal
          as="div"
          delay={delay}
          className="group/heat pointer-events-none absolute inset-0 block"
        >
          <span
            aria-hidden
            className="absolute inset-0 block bg-gradient-to-b from-[#ff4d5e]/65 via-[#c45ad8]/25 via-45% to-accent/35 mix-blend-screen [clip-path:inset(0_0_100%_0)] transition-[clip-path] duration-[1400ms] ease-out group-data-[visible=true]/heat:[clip-path:inset(0_0_0_0)]"
          />
        </Reveal>
      </div>
      <figcaption className="mt-3 text-xs font-medium text-white/50 sm:text-sm">
        {label}
      </figcaption>
    </figure>
  );
}

/**
 * 상품 목록 스크롤 키프레임. 이 컴포넌트에서만 쓰여 globals.css 대신 여기
 * 둔다. 움직임 줄이기 설정이면 멈춘다.
 */
const SCROLL_CSS = `
@keyframes slot-scroll { from { transform: translateY(0); } to { transform: translateY(-50%); } }
.slot-scroll { animation: slot-scroll 14s linear infinite; }
@media (prefers-reduced-motion: reduce) { .slot-scroll { animation: none; } }
`;

export default function SlotHeatmap({
  phones,
  high,
  low,
  caption,
  note,
}: {
  phones: readonly [string, string];
  high: string;
  low: string;
  caption: string;
  note: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <style>{SCROLL_CSS}</style>
      <div className="flex items-stretch gap-3 sm:gap-6">
        <Phone label={phones[0]} variant="grid" delay={100} />

        {/* 가운데 눈금 — 위 "매우 높음", 아래 "낮음" */}
        <div
          aria-hidden
          className="flex flex-col items-center pb-8 text-center text-[0.65rem] leading-tight font-bold text-white/60 sm:text-xs"
        >
          <span className="whitespace-pre-line">{high}</span>
          <span className="my-3 block w-[3px] flex-1 rounded-full bg-gradient-to-b from-[#ff4d5e] via-[#c45ad8] to-accent" />
          <span>{low}</span>
        </div>

        <Phone label={phones[1]} variant="list" delay={250} />
      </div>

      <p className="mt-8 text-sm font-bold text-white sm:text-base">
        {caption}
      </p>
      <p className="mt-1.5 text-xs text-white/45 sm:text-sm">{note}</p>
    </div>
  );
}
