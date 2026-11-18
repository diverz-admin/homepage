/**
 * PLATFORM 카드 위쪽 그림 — 카드 셋이 각각 말하는 바를 작은 화면으로 보여 준다.
 *
 *  signal  여러 신호 막대가 차례로 차오른다(랭킹이 행동 하나하나를 읽는다).
 *  shift   가중치 막대 높이가 계속 바뀐다(기준이 예고 없이 바뀐다).
 *  filter  유입 점들이 내려오다 부자연스러운 점만 걸러져 빠진다.
 *
 * 카드(Reveal, className 에 group/logic)가 화면에 들어오면
 * group-data-[visible=true]/logic 으로 움직임이 시작된다. 색은 accent 만 쓴다.
 */

type Name = "signal" | "shift" | "filter";

const CSS = `
@keyframes logic-weight { 0%,100% { transform: scaleY(var(--a)); } 33% { transform: scaleY(var(--b)); } 66% { transform: scaleY(var(--c)); } }
.logic-weight { transform-origin: 50% 100%; animation: logic-weight 4.8s cubic-bezier(.65,0,.35,1) infinite; }
@keyframes logic-drop { 0% { transform: translateY(-14px); opacity: 0; } 15% { opacity: 1; } 55% { transform: translateY(26px); opacity: 1; } 100% { transform: translateY(58px); opacity: 0; } }
@keyframes logic-reject { 0% { transform: translateY(-14px); opacity: 0; } 15% { opacity: 1; } 50% { transform: translateY(24px); opacity: 1; } 100% { transform: translate(var(--dx), 30px) scale(.4); opacity: 0; } }
.logic-pass { animation: logic-drop 2.6s ease-in infinite; }
.logic-fail { animation: logic-reject 2.6s ease-in infinite; }
@keyframes logic-blink { 0%,100% { opacity: 1; } 50% { opacity: .25; } }
.logic-blink { animation: logic-blink 1.4s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .logic-weight, .logic-pass, .logic-fail, .logic-blink { animation: none; }
}
`;

/** 그림 공통 틀 — 어두운 화면 + 위쪽 상태 줄. */
function Screen({
  status,
  children,
}: {
  status: string;
  children: React.ReactNode;
}) {
  return (
    <div
      aria-hidden
      className="relative h-44 overflow-hidden rounded-xl border border-white/8 bg-abyss/70 px-5 pt-4 pb-5"
    >
      <div className="flex items-center gap-2 text-[0.7rem] font-bold tracking-wide text-accent/80">
        <span className="logic-blink block h-1.5 w-1.5 rounded-full bg-accent" />
        {status}
      </div>
      {children}
    </div>
  );
}

const SIGNALS = [
  { label: "체류 시간", w: "86%" },
  { label: "유입 경로", w: "64%" },
  { label: "클릭 흐름", w: "92%" },
  { label: "재방문", w: "48%" },
];

function Signal() {
  return (
    <Screen status="행동 신호 분석 중">
      <ul className="mt-4 grid gap-2.5">
        {SIGNALS.map((s, i) => (
          <li key={s.label} className="flex items-center gap-3">
            <span className="w-14 shrink-0 text-[0.7rem] text-white/50">
              {s.label}
            </span>
            <span className="relative block h-1.5 flex-1 overflow-hidden rounded-full bg-white/8">
              <span
                className="absolute inset-y-0 left-0 block w-0 rounded-full bg-gradient-to-r from-accent/40 to-accent transition-[width] duration-[1200ms] ease-out group-data-[visible=true]/logic:w-[var(--w)] motion-reduce:w-[var(--w)]"
                style={
                  {
                    "--w": s.w,
                    transitionDelay: `${400 + i * 180}ms`,
                  } as React.CSSProperties
                }
              />
            </span>
          </li>
        ))}
      </ul>
    </Screen>
  );
}

/** 가중치 막대 — 막대마다 세 단계 높이를 돌며 엇갈려 바뀐다. */
const WEIGHTS = [
  [0.7, 0.35, 0.55],
  [0.4, 0.8, 0.3],
  [0.9, 0.5, 0.75],
  [0.3, 0.65, 0.9],
  [0.6, 0.25, 0.45],
  [0.45, 0.9, 0.6],
];

function Shift() {
  return (
    <Screen status="로직 기준 변경 감지">
      <div className="mt-4 flex h-[5.5rem] items-end gap-2.5 border-b border-white/10">
        {WEIGHTS.map(([a, b, c], i) => (
          <span
            key={i}
            className="logic-weight block h-full flex-1 rounded-t-md bg-gradient-to-t from-accent/25 to-accent/80"
            style={
              {
                "--a": a,
                "--b": b,
                "--c": c,
                animationDelay: `${i * -0.7}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      <p className="mt-2.5 text-[0.7rem] text-white/40">사전 공지 없음</p>
    </Screen>
  );
}

/** 유입 점 — fail 은 필터 줄에서 옆으로 튕겨 나간다. */
const DOTS = [
  { x: "8%", fail: false, d: 0 },
  { x: "22%", fail: true, dx: "-18px", d: 0.9 },
  { x: "36%", fail: false, d: 1.6 },
  { x: "50%", fail: false, d: 0.4 },
  { x: "64%", fail: true, dx: "18px", d: 2.0 },
  { x: "78%", fail: false, d: 1.2 },
  { x: "90%", fail: true, dx: "16px", d: 0.6 },
];

function Filter() {
  return (
    <Screen status="부자연 유입 필터링">
      <div className="relative mt-3 h-[6.25rem]">
        {DOTS.map((dot, i) => (
          <span
            key={i}
            className={`absolute top-3 block h-2.5 w-2.5 -translate-x-1/2 rounded-full ${
              dot.fail
                ? "logic-fail border border-white/50 bg-transparent"
                : "logic-pass bg-accent"
            }`}
            style={
              {
                left: dot.x,
                "--dx": dot.dx,
                animationDelay: `${dot.d}s`,
              } as React.CSSProperties
            }
          />
        ))}
        {/* 필터 줄 */}
        <span className="absolute inset-x-0 top-[3.1rem] block h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex justify-between text-[0.7rem]">
          <span className="text-white/50">
            <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-accent align-middle" />
            정상 유입 통과
          </span>
          <span className="text-white/50">
            <span className="mr-1.5 inline-block h-2 w-2 rounded-full border border-white/50 align-middle" />
            감점 처리
          </span>
        </div>
      </div>
    </Screen>
  );
}

export default function LogicVisual({ name }: { name: Name }) {
  return (
    <>
      <style>{CSS}</style>
      {name === "signal" && <Signal />}
      {name === "shift" && <Shift />}
      {name === "filter" && <Filter />}
    </>
  );
}
