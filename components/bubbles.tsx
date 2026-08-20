/**
 * 배경에 떠오르는 기포. 장식이므로 스크린리더에서 숨긴다.
 * 위치·크기는 고정 배열로 두어 SSR/CSR 결과가 갈리지 않게 한다.
 */
const BUBBLES = [
  { left: "8%", size: 6, duration: 18, delay: 0 },
  { left: "17%", size: 3, duration: 24, delay: 4 },
  { left: "31%", size: 8, duration: 15, delay: 2 },
  { left: "44%", size: 4, duration: 21, delay: 7 },
  { left: "58%", size: 5, duration: 17, delay: 1 },
  { left: "69%", size: 3, duration: 26, delay: 5 },
  { left: "77%", size: 7, duration: 19, delay: 9 },
  { left: "88%", size: 4, duration: 23, delay: 3 },
  { left: "95%", size: 5, duration: 16, delay: 6 },
];

export default function Bubbles({
  /**
   * 히어로처럼 화면 높이만 한 섹션 기준의 기본 rise는 이동 거리가
   * 110vh다. 푸터처럼 훨씬 낮은 섹션에 그대로 쓰면 대부분의 구간이
   * 보이는 영역 밖에서 지나가 거의 안 보인다 — 그런 곳에 compact를 켠다.
   */
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className={compact ? "bubble bubble--compact" : "bubble"}
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
