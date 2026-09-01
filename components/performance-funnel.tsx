import Reveal from "@/components/reveal";
import { PROCESS_BAND_BG } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { performanceFeatures, performanceFunnel } from "@/lib/site";

/**
 * 퍼포먼스 마케팅 블록 — 콘텐츠 지면의 제작 공정(components/
 * contents-production.tsx 의 Process)과 같은 톤앤매너로 맞춘다.
 *
 * 그 톤을 이루는 것은 넷이다.
 *   1) 화면 좌우 끝까지 덮는 어두운 띠(.bleed-x + PROCESS_BAND_BG)
 *   2) 하늘색 작은 라벨 + 그 옆으로 뻗는 실선
 *   3) 머리카락처럼 얇은 레일 — 굵은 그라디언트 바가 아니다
 *   4) 레일 위에 앉은, 옅은 빛을 두른 흰 구슬
 *
 * 두 지면의 PROCESS 묶음이 같은 판 위에 서야 한 벌로 읽힌다.
 *
 * 색은 역할 토큰(text-foreground 등)을 쓰지 않고 직접 준다 — 이 블록이
 * 놓이는 서비스 지면은 .on-light 라 토큰이 흰 배경용으로 뒤집혀 있는데,
 * 띠 안쪽은 그 반전이 닿지 않는 자리다.
 */
export default function PerformanceFunnel() {
  return (
    /* .section-gap(112/152/176px) 대신 직접 잡는다 — 바로 위 상품 본문은
       오른쪽 개념도가 왼쪽 글보다 훨씬 길어서, 그리드 행이 그림 높이에
       맞춰지며 왼쪽 아래에 이미 빈 칸이 한참 남는다. 그 빈 칸이 사실상
       여백 노릇을 하는 데다, 아래 띠도 자기 안쪽에 py-24~32 를 갖고 있어
       지면 기본 리듬까지 얹으면 본문과 띠가 끊어져 보인다.
       (콘텐츠 지면의 WHY DIVERZ 블록도 같은 이유로 같은 값을 쓴다 —
       components/ui/feature-section-with-bento-grid.tsx)
       globals.css 가 레이어 밖이라 .section-gap 을 같이 쓰면 mt-* 가 지므로
       클래스를 아예 빼야 한다. */
    <div className="mt-8 sm:mt-10 xl:mt-12">
      <div
        className="bleed-x py-24 sm:py-28 xl:py-32"
        style={{ backgroundImage: PROCESS_BAND_BG }}
      >
        <div className="page-container">
          <Reveal>
            <div className="flex items-center gap-4">
              <p className="font-display text-xs font-bold tracking-[0.25em] text-[#acd4ff]">
                PERFORMANCE PROCESS
              </p>
              <span aria-hidden className="h-px flex-1 bg-white/15" />
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
                  {/* 머리 실선을 걷어냈다 — 라벨 옆 실선과 두 줄이 겹쳐 보여
                번호 위가 시끄러웠다. 셋을 가르는 건 이제 여백뿐이다. */}
                  <p className="font-display text-[0.78rem] font-bold tracking-[0.2em] text-[#acd4ff] tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 font-display text-fluid-lg font-bold break-keep tracking-tight text-white">
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
                  <p className="mt-3 text-fluid-base leading-relaxed break-keep text-balance text-white/55 lg:min-h-[3.4em] 2xl:min-h-0">
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
                  <Reveal
                    key={stage.title}
                    delay={i * 60}
                    className="flex gap-4"
                  >
                    <div className="flex flex-col items-center">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white font-display text-[0.8rem] font-bold text-abyss shadow-[0_0_16px_3px_rgb(172_212_255_/_0.45)]">
                        {no}
                      </span>
                      {i < performanceFunnel.length - 1 && (
                        <span
                          aria-hidden
                          className="mt-1 w-px flex-1 bg-white/20"
                        />
                      )}
                    </div>
                    <div className="pb-2">
                      <h3 className="text-fluid-lg font-bold break-keep whitespace-pre-line text-white">
                        {stage.title.replace("\n", " ")}
                      </h3>
                      <p className="mt-1.5 text-fluid-base leading-snug break-keep text-white/55">
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
                  className="absolute inset-x-3 top-1/2 h-px -translate-y-1/2 bg-white/20"
                />
                <div className="relative grid grid-cols-4">
                  {performanceFunnel.map((stage, i) => {
                    const no = String(i + 1).padStart(2, "0");
                    const content = (
                      <>
                        <h3 className="text-fluid-lg font-bold break-keep whitespace-pre-line text-white">
                          {stage.title.replace("\n", " ")}
                        </h3>
                        <p className="mt-2 text-fluid-base leading-snug break-keep text-balance text-white/55">
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
                          "h-3 w-px bg-white/25",
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
                        <span className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full bg-white font-display text-[0.7rem] font-bold text-abyss shadow-[0_0_18px_4px_rgb(172_212_255_/_0.4)]">
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
      </div>
    </div>
  );
}
