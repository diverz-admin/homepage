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

export default function Bubbles() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className="bubble"
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
