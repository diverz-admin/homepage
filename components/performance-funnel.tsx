import Reveal from "@/components/reveal";
import { cn } from "@/lib/utils";
import { performanceFeatures, performanceFunnel } from "@/lib/site";

/**
 * 퍼포먼스 마케팅 블록 — IMC PROCESS(가로 흐름 바 타임라인)와 같은
 * 톤앤매너로 맞춘다: 카드/테두리 없이 페이지에 바로 얹고, 같은 그라디언트
 * 바 + 지그재그 라벨 + 얇은 연결 틱 문법을 그대로 재사용한다.
 *
 * 색은 절대 팔레트(text-abyss 등)가 아니라 역할 토큰(text-foreground 등)을
 * 쓴다 — 패널 톤(FlowSection의 light/dark)에 따라 이 블록도 같이 뒤집혀야
 * IMC PROCESS와 항상 같은 룩을 유지한다.
 */
export default function PerformanceFunnel() {
  return (
    <div className="section-gap">
      <Reveal>
        <div className="flex items-center gap-4">
          <p className="font-display text-xs font-bold tracking-[0.25em] text-accent">
            PERFORMANCE PROCESS
          </p>
          <span aria-hidden className="h-px flex-1 bg-foreground/10" />
        </div>
      </Reveal>

      {/* 왼쪽 강점 3가지 · 오른쪽 성과 곡선의 2단.
          오른쪽 칸을 1fr로 열어 두는 건 곡선이 min-w-[880px]를 요구해서다 —
          왼쪽 레일을 17rem으로 못 박고 남는 폭을 전부 곡선에 준다.
          2xl 아래에서는 폭이 모자라 2단이 성립하지 않으므로(오른쪽 칸이
          880px를 못 채운다) 위아래로 쌓고, 그때는 강점이 다시 3열로 펴진다. */}
      <div className="mt-10 grid gap-12 2xl:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] 2xl:items-center 2xl:gap-14">
        {/* 강점 3가지.
          카드·테두리·구분선 없이 여백과 번호만으로 칸을 나눈다.
          lg(1024px) 미만에서는 숨긴다 — 3열이 제대로 펴지지 않는 폭에서는
          세 덩이가 세로로 길게 늘어져, 정작 이 블록의 주인공인 성과 곡선까지
          한참 스크롤해야 닿는다.
          번호만 액센트로 두고 제목은 전부 foreground다. 예전에는 첫 칸
          제목만 액센트였는데, 셋이 같은 위계인 항목에서 하나만 색이 다르면
          거기에 뜻이 있는 것처럼 읽힌다. */}
        <ul className="hidden gap-10 lg:grid lg:grid-cols-3 2xl:grid-cols-1 2xl:gap-7">
          {performanceFeatures.map((feature, i) => (
            <Reveal as="li" key={feature.title} delay={i * 70}>
              {/* 머리 실선 — 셋을 가르는 유일한 경계다. 3열로 설 때는 세
                실선이 한 줄로 이어져 칸의 윗변이 되고, 1열 레일로 접힐
                때는 항목 사이 구분선이 된다. 카드나 테두리를 두르지 않는
                이 지면의 문법(오른쪽 흐름 바도 선 하나로 서 있다)에서
                실선 한 줄이 가장 조용한 경계다. */}
              <span
                aria-hidden
                className="block h-px w-full bg-gradient-to-r from-accent/45 to-transparent"
              />
              <p className="mt-5 font-display text-[0.78rem] font-bold tracking-[0.2em] text-accent tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 font-display text-fluid-lg font-bold break-keep tracking-tight text-foreground">
                {feature.title}
              </h3>
              {/* text-balance — 두 줄로 넘어갈 때 길이를 고르게 나눠, 첫 줄이
                꽉 차고 "효율 극대화"만 다음 줄에 남는 걸 막는다.
                lg:min-h — 3열로 나란히 설 때 셋 중 하나만 두 줄이면 칸
                높이가 어긋난다. 두 줄 자리를 미리 잡아 밑선을 맞춘다.
                (globals.css의 `p { line-height: 1.7 }`가 레이어 밖이라
                leading-relaxed를 이기므로 2줄 = 3.4em으로 계산한다.)
                2xl에서는 1열 레일이라 높이를 맞출 이유가 없어 푼다.
                break-keep — 한글 단어 중간에서 끊지 않는다. */}
              <p className="mt-3 text-fluid-base leading-relaxed break-keep text-balance text-foreground/55 lg:min-h-[3.4em] 2xl:min-h-0">
                {feature.body}
              </p>
            </Reveal>
          ))}
        </ul>

        {/* 모바일 전용 세로 타임라인 — IMC PROCESS와 같은 이유로 둔다.
          가로 지그재그는 min-w-[880px]라 좁은 화면에서는 옆으로 긁어야만
          다음 단계가 보여 한눈에 안 읽힌다. */}
        <div className="space-y-8 sm:hidden">
          {performanceFunnel.map((stage, i) => {
            const no = String(i + 1).padStart(2, "0");
            return (
              <Reveal key={stage.title} delay={i * 60} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-soft to-abyss font-display text-[0.8rem] font-bold text-white">
                    {no}
                  </span>
                  {i < performanceFunnel.length - 1 && (
                    <span
                      aria-hidden
                      className="mt-1 w-px flex-1 bg-foreground/15"
                    />
                  )}
                </div>
                <div className="pb-2">
                  <h3 className="text-fluid-lg font-bold break-keep whitespace-pre-line text-foreground">
                    {stage.title.replace("\n", " ")}
                  </h3>
                  <p className="mt-1.5 text-fluid-base leading-snug break-keep text-foreground/55">
                    {stage.body.replace(/\n/g, " ")}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* 성과 곡선 4단계(sm 이상) — IMC PROCESS와 동일한 그라디언트 바 + 지그재그
          구조. 6칸 대신 4칸이라 grid-cols-4로 좁힌 것만 다르다.
          2단일 때는 오른쪽 칸을 꽉 채우고, 위아래로 쌓일 때는 IMC PROCESS와
          같이 w-[90%]로 좁혀 가운데에 둔다.
          min-w-[880px]가 남아 있어 폭이 모자라면 가로로 스크롤한다. */}
        <div className="mx-auto hidden w-[90%] overflow-x-auto pb-2 sm:block 2xl:mx-0 2xl:w-full">
          <div className="relative min-w-[880px]">
            <div
              aria-hidden
              className="absolute inset-x-3 top-1/2 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-accent-soft via-mid to-abyss"
            />
            <div className="relative grid grid-cols-4">
              {performanceFunnel.map((stage, i) => {
                const no = String(i + 1).padStart(2, "0");
                const content = (
                  <>
                    <h3 className="text-fluid-lg font-bold break-keep whitespace-pre-line text-foreground">
                      {stage.title.replace("\n", " ")}
                    </h3>
                    <p className="mt-2 text-fluid-base leading-snug break-keep text-balance text-foreground/55">
                      {stage.body.replace(/\n/g, " ")}
                    </p>
                  </>
                );
                /* 잇는 실선 — 글 묶음과 구슬 사이. 쓰지 않는 쪽도 자리는
                 그대로 잡아 둔다(invisible). 위아래 높이가 같아야 구슬이
                 바 한가운데에 선다. */
                const tick = (side: "above" | "below") => (
                  <span
                    aria-hidden
                    className={cn(
                      "h-3 w-px bg-foreground/20",
                      stage.above !== (side === "above") && "invisible",
                    )}
                  />
                );
                return (
                  <Reveal
                    key={stage.title}
                    delay={i * 60}
                    className="flex flex-col items-center px-3"
                  >
                    <div
                      className={cn(
                        "flex min-h-28 flex-col items-center justify-end pb-1 text-center",
                        !stage.above && "invisible",
                      )}
                    >
                      {content}
                    </div>
                    {tick("above")}

                    {/* 번호를 바 위의 구슬에 담는다. 예전에는 글 묶음 머리에
                      작은 액센트 글자로 떠 있고 바에는 실오라기 같은 틱만
                      닿아서, 네 단계가 "선 위의 정거장"으로 읽히지 않았다.
                      좁은 화면 세로 타임라인이 이미 같은 구슬을 쓰고 있어
                      (위 sm:hidden 묶음), 두 판형이 한 벌로 맞는다.

                      ring-background — 지면 색으로 한 겹 두르면 구슬이 바를
                      뚫고 앉은 것처럼 보인다. 흰색으로 박지 않는 건 이
                      블록이 어두운 패널에 얹힐 수도 있어서다. */}
                    <span className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-soft to-abyss font-display text-[0.7rem] font-bold text-white ring-4 ring-background">
                      {no}
                    </span>

                    {tick("below")}
                    <div
                      className={cn(
                        "flex min-h-28 flex-col items-center justify-start pt-1 text-center",
                        stage.above && "invisible",
                      )}
                    >
                      {content}
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
