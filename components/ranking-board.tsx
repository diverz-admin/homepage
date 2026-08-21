import Reveal from "@/components/reveal";

/**
 * 상위노출 실적 — 키워드별 "초기 순위 → 현재 순위" 상승 곡선.
 *
 * 채널마다 한 벌씩 쓴다(네이버 플레이스 · 네이버 쇼핑). 예전에는 스마트스토어
 * 전용이라 데이터를 컴포넌트가 직접 import 했는데, 채널이 늘면서 넘겨받는
 * 쪽으로 바꿨다.
 *
 * 원본 자료는 카드마다 보라·주황·분홍·파랑·초록으로 색을 달리 쓰지만,
 * 여기서는 전부 다이버즈 블루 스케일 하나로 통일한다. 이 사이트의 팔레트는
 * "색으로 소리치지 않고 여백과 위계로 말하는" 쪽이라(globals.css), 칸마다
 * 색이 다르면 그 색에 뜻이 있는 것처럼 읽히고 톤도 깨진다. 대신 순위 숫자와
 * 상승 폭에 위계를 줘서 읽히게 한다.
 *
 * 카드·테두리도 쓰지 않는다 — 같은 패널의 VIRAL CHANNELS와 맞춘다.
 *
 * 곡선과 상승 폭은 accent가 아니라 foreground를 쓴다. 이 블록이 얹히는
 * 바이럴 패널의 배경이 shallow(#a8c0da)라, .on-light가 내려 준 accent(mid,
 * #5b7897)로는 대비가 2.6:1밖에 안 나와 글씨가 묻힌다. foreground는 두 톤
 * 어디서든 배경과 가장 먼 색이라 그대로 써도 항상 읽힌다.
 */

/** 곡선 좌표계. preserveAspectRatio="none"이라 칸 폭이 달라도 같은 모양이 된다. */
const W = 200;
const H = 108;
const X0 = 12;
const X1 = W - 12;
const Y0 = H - 16; // 초기 순위(낮은 자리)
const Y1 = 16; // 현재 순위(높은 자리)

/** 뒤로 갈수록 가팔라지는 상승 곡선. 칸마다 같은 모양을 쓴다. */
const CURVE = `M ${X0},${Y0} C ${X0 + 88},${Y0 - 6} ${X1 - 46},${Y1 + 44} ${X1},${Y1}`;
const AREA = `${CURVE} L ${X1},${Y0} L ${X0},${Y0} Z`;

export type RankingItem = {
  keyword: string;
  /**
   * 초기 순위. 없으면 현재 순위만 적고 상승 곡선은 그리지 않는다.
   *
   * 곡선과 "▲ N위 상승"은 둘 다 "얼마나 올랐다"는 주장이라, 초기 순위를
   * 모르는 채로 그리면 근거 없는 상승을 그린 그림이 된다.
   */
  from?: number;
  /** 현재 순위 */
  to: number;
};

export default function RankingBoard({
  label,
  channel,
  items,
  reverse,
  duration = 44,
}: {
  /** 묶음 머리에 붙는 영문 라벨. 예: "NAVER PLACE RANKING" */
  label: string;
  /** 칸마다 키워드 옆에 붙는 채널명. 예: "네이버 플레이스" */
  channel: string;
  items: readonly RankingItem[];
  /** 흐르는 방향을 뒤집는다. 보드를 둘 이상 쌓을 때 서로 반대로 둔다. */
  reverse?: boolean;
  /** 한 바퀴 도는 시간(초). 길수록 느리다. */
  duration?: number;
}) {
  /* 이어붙이기용으로 목록을 두 벌 늘어놓고 -50%까지 옮기면 끊김 없이
     반복된다(클라이언트 로고 월과 같은 방식). 스크린리더에는 한 벌만
     있는 것처럼 들리도록 흐르는 줄 전체를 aria-hidden 으로 감추고,
     실제 목록은 아래 sr-only 로 한 번만 노출한다. */
  const doubled = [...items, ...items];
  return (
    <div className="mt-16">
      <Reveal>
        <div className="flex items-center gap-4">
          <p className="font-display text-xs font-bold tracking-[0.25em] text-accent">
            {label}
          </p>
          <span aria-hidden className="h-px flex-1 bg-foreground/10" />
        </div>
      </Reveal>

      {/* 양옆 끝은 배경으로 서서히 사라지게 마스크만 얹는다 — 잘린 칸이
          경계에서 뚝 끊기면 흐르는 느낌이 아니라 잘린 것으로 보인다. */}
      <div
        className="marquee-row mt-10 w-full overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, #000 4%, #000 96%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, #000 4%, #000 96%, transparent)",
        }}
      >
        <ul
          aria-hidden
          className={`flex w-max gap-8 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
          style={{ animationDuration: `${duration}s` }}
        >
          {doubled.map((item, i) => {
            const rise = item.from === undefined ? null : item.from - item.to;
            /* 그라디언트 id는 문서 전체에서 유일해야 한다 — 같은 id가 여러 번
             나오면 브라우저가 첫 번째 것만 쓴다. */
            const fillId = `rise-${label}-${item.keyword}`.replace(/\s+/g, "-");

            return (
              <li key={`${item.keyword}-${i}`} className="w-[15.5rem] shrink-0">
                <div className="border-t border-foreground/10 pt-6">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-sm font-bold text-foreground">
                      {item.keyword}
                    </h3>
                    <span className="shrink-0 text-[0.68rem] font-medium tracking-[0.06em] text-foreground/40">
                      {channel}
                    </span>
                  </div>

                  <p className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-fluid-xl font-bold tracking-tight text-foreground tabular-nums">
                      {item.to}위
                    </span>
                    {rise !== null && (
                      <span className="text-[0.78rem] font-bold text-foreground/80 tabular-nums">
                        ▲ {rise}위 상승
                      </span>
                    )}
                  </p>

                  {/* 곡선. 숫자는 위에 다 적혀 있으므로 그림 자체는 장식이다.
                    초기 순위를 모르면 그리지 않는다 — 위 타입 주석 참고. */}
                  {rise !== null && (
                    <svg
                      aria-hidden
                      viewBox={`0 0 ${W} ${H}`}
                      preserveAspectRatio="none"
                      className="mt-4 h-24 w-full text-foreground/70"
                    >
                      <defs>
                        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="0%"
                            stopColor="currentColor"
                            stopOpacity="0.28"
                          />
                          <stop
                            offset="100%"
                            stopColor="currentColor"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>

                      {/* 양 끝 세로 안내선 */}
                      {[X0, X1].map((x) => (
                        <line
                          key={x}
                          x1={x}
                          y1={x === X0 ? Y0 : Y1}
                          x2={x}
                          y2={H}
                          stroke="currentColor"
                          strokeOpacity="0.18"
                          strokeWidth="1"
                          strokeDasharray="2 3"
                          vectorEffect="non-scaling-stroke"
                        />
                      ))}

                      <path d={AREA} fill={`url(#${fillId})`} />
                      <path
                        d={CURVE}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                      />

                      {/* 시작점은 빈 원, 끝점은 채운 원 — 방향이 한눈에 읽힌다. */}
                      <circle
                        cx={X0}
                        cy={Y0}
                        r="3.5"
                        fill="var(--background)"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        vectorEffect="non-scaling-stroke"
                      />
                      <circle cx={X1} cy={Y1} r="4" fill="currentColor" />
                    </svg>
                  )}

                  {rise !== null && (
                    <p className="mt-1 flex justify-between text-[0.68rem] text-foreground/40 tabular-nums">
                      <span>초기 {item.from}위</span>
                      <span>현재 {item.to}위</span>
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 시각적으로는 흐르는 줄 대신, 실제 목록은 여기 한 번만 노출한다. */}
      <ul className="sr-only">
        {items.map((item) => (
          <li key={item.keyword}>
            {item.keyword} — {channel} 현재 {item.to}위
            {item.from !== undefined && ` (초기 ${item.from}위)`}
          </li>
        ))}
      </ul>
    </div>
  );
}
