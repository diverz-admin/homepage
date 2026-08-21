import Image from "next/image";
import CountUp from "@/components/count-up";
import Reveal from "@/components/reveal";
import { stats } from "@/lib/site";

/**
 * 성과 수치 섹션.
 *
 * 수치는 가로 3열이 아니라 오른쪽 단에 위에서 아래로 쌓는다. 제목·CTA는
 * 왼쪽에 두고, 왼쪽 단은 스크롤 동안 붙여 둬서(lg:sticky) 오른쪽 수치가
 * 하나씩 내려오는 동안 제목이 화면에 남아 있게 한다 — 섹션 전체가
 * "내려간다"는 브랜드 동선과 같은 방향으로 읽힌다.
 *
 * 판형은 잡지식 통계 지면을 따른다. 카드도 표도 아니고, 수치 하나하나가
 * 지면 위에 놓인 큰 활자다. 그 인상을 만드는 장치는 셋뿐이다.
 *
 *  1) 뒤에 깔린 거대한 워터마크 단어 — 배경을 "면"이 아니라 "지면"으로 만든다.
 *  2) 수치 뒤에서 시작해 화면 밖으로 빠져나가는 헤어라인 — 지면이 화면보다
 *     넓다는 인상을 준다. 수치마다 자릿수가 달라 선이 시작하는 위치가
 *     제각각인데, 그 어긋남이 이 판형의 리듬이다(가지런히 맞추면 표가 된다).
 *  3) 큰 활자를 굵게 — 수치가 이 섹션에서 가장 먼저 읽혀야 하는 요소라
 *     굵기로 무게를 준다. 대신 자간을 -0.04em까지 조여, 어두운 바탕 위
 *     밝은 글자가 굵어질 때 생기는 번짐을 눌러 준다.
 *
 * 예전에 있던 01/02/03 인덱스는 뺐다. 이 셋은 순서가 있는 단계가 아니라
 * 나란한 지표라서, 번호를 붙이면 없는 순서를 있다고 말하게 된다.
 */
export default function GrowthStats() {
  return (
    /* overflow-x-clip — 헤어라인이 화면 밖으로 나가며 만드는 가로 스크롤을
       자른다. overflow-hidden 은 스크롤 컨테이너가 돼서 왼쪽 단의 sticky 가
       통째로 죽으므로 쓰면 안 된다(clip 은 스크롤 컨테이너를 만들지 않는다). */
    <section className="relative overflow-x-clip bg-[linear-gradient(180deg,var(--ocean-deep)_0%,var(--ocean-abyss)_100%)] pt-8 pb-20 sm:pt-10 sm:pb-24">
      {/* 배경 장식은 별도 클립 래퍼에 가둔다. 섹션에 overflow-hidden을 주면
          섹션이 스크롤 컨테이너가 돼서 왼쪽 단의 sticky가 통째로 죽는다.

          대각선 광선(god-rays)과 "Record" 워터마크는 뺐다. 배경은 세로
          그라디언트 하나로만 두고, 층은 아래 광원 하나로 만든다. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* 수치 단 뒤에 옅은 광원을 깔아 평평한 그라디언트 위에 층을 하나 만든다. */}
        <div className="absolute inset-y-0 right-0 w-[60%] bg-[radial-gradient(60%_50%_at_70%_50%,rgb(124_156_196/0.13),transparent_70%)] blur-3xl" />

        {/* 수면으로 떠오르는 다이버.
        
            왼쪽 끝에 세로로 세우고 화면 밖으로 조금 물린다 — 다이버가 위로
            상승하는 방향이 브랜드 동선(DIVE DEEP, RISE FAST)과 같다.

            제목·설명이 이 사진 위에 얹힌다. 그래서 object-position 을 44% 로
            올려 다이버 실루엣이 글자 아래쪽으로 내려오게 했다. 실루엣이 글자
            뒤로 정확히 겹치면 둘 다 안 읽힌다.

            사진을 그대로 얹으면 사각형 경계가 그대로 보이므로 두 겹으로 녹인다.
             1) mask-image 타원 — 네 방향 가장자리가 모두 서서히 사라진다.
             2) 그 안의 네이비 그라디언트 — 왼쪽(제목·설명이 얹히는 쪽)을 더
                짙게 덮어 글자 대비를 지킨다.

            둘 다 같은 마스크 래퍼 안에 넣는 게 중요하다. 덮개를 마스크 밖에
            두면 덮개 자체가 사각형으로 남아, 사진은 녹았는데 그 자리에
            네모난 어두운 판이 보인다(실제로 그렇게 보였다).

            lg 미만에서는 감춘다. 한 단으로 쌓이면 통로가 없어져서 사진이
            글자 바로 뒤로 들어온다. */}
        <div className="absolute inset-y-0 left-0 hidden w-[min(1020px,64vw)] -translate-x-[14%] lg:block">
          <div
            className="absolute inset-0"
            style={{
              maskImage:
                "radial-gradient(60% 52% at 48% 52%, #000 0%, rgb(0 0 0 / 0.72) 48%, transparent 84%)",
              WebkitMaskImage:
                "radial-gradient(60% 52% at 48% 52%, #000 0%, rgb(0 0 0 / 0.72) 48%, transparent 84%)",
            }}
          >
            <Image
              src="/images/diver-rising.jpg"
              alt=""
              fill
              sizes="(min-width: 1024px) 64vw, 0px"
              className="diver-rise object-cover object-[50%_44%]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(var(--ocean-abyss-rgb)/0.62)_0%,rgb(var(--ocean-abyss-rgb)/0.6)_46%,rgb(var(--ocean-abyss-rgb)/0.28)_74%,rgb(var(--ocean-abyss-rgb)/0.35)_100%)]" />
          </div>
        </div>
      </div>

      <div className="relative z-10 page-container">
        {/* 섹션 라벨("WHY DIVERZ" + 헤어라인)은 뺐다. 제목이 곧 라벨 역할을
            하고, 수치 뒤로 뻗는 헤어라인과 선이 두 번 겹쳐 보였다. */}
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,40rem)] lg:gap-20">
          {/* 왼쪽 칸은 비워 둔다 — 뒤에 깔린 다이버 사진의 자리다.
              글을 넣지 않고 폭만 잡아 주면, 사진이 오른쪽 단(수치)과 겹치지
              않는 선이 그리드에서 자동으로 정해진다. */}
          <div aria-hidden className="hidden lg:block" />

          {/* 오른쪽 — 제목·설명이 먼저 오고, 그 아래로 수치가 쌓인다.
              제목을 왼쪽 칸에 두던 예전 구성은 사진 자리를 반으로 갈라 썼는데,
              이제 왼쪽을 통째로 사진에 내주면서 글은 전부 이쪽으로 모았다. */}
          <div>
            <Reveal>
              {/* GradientLine은 줄마다 block을 씌우므로 쓰면 강제로 2줄이 된다.
                  한 줄로 흘리고, 폭이 모자랄 때만 break-keep 규칙으로 접히게 둔다. */}
              <h2 className="font-display text-fluid-2xl font-bold tracking-tight text-balance break-keep">
                다이버즈와 함께해야 하는 이유
              </h2>
            </Reveal>
            <Reveal delay={120}>
              {/* 개행을 br로 직접 잡는다. 자연 개행에 맡기면 마지막 어절만
                  떨어져 나가서 끝이 흐려진다. 두 줄 — 앞이 주장, 뒤가 근거. */}
              <p className="mt-6 max-w-lg text-sm leading-[1.9] break-keep text-white/55">
                한 번의 캠페인보다 중요한 건, 계속 함께할 수 있는 결과입니다.
                <br />
                다이버즈는 브랜드와 오래 호흡하며 성장을 도왔습니다.
              </p>
            </Reveal>

            {/* 수치가 위에서 아래로 하나씩 내려온다. */}
            <dl className="mt-20 flex flex-col gap-20 sm:mt-24 sm:gap-24">
              {stats.map((stat, i) => (
                <Reveal key={stat.label} delay={i * 140}>
                  <div>
                    {/* 지표명과 설명은 한 줄에 붙인다. 굵기와 밝기로만 갈라
                      두 줄로 쪼개지 않는 게 이 판형의 규칙이다. */}
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <dt className="text-sm font-semibold tracking-tight text-white">
                        {stat.label}
                      </dt>
                      <span className="text-xs text-white/40">{stat.note}</span>
                    </div>

                    {/* 글자 크기를 이 줄(부모)에 걸어 둔다. 헤어라인의 여백을
                      em으로 잡아 수치 크기에 따라 같이 움직이게 하려는 것 —
                      화면 폭이 바뀌어도 선이 늘 베이스라인 근처에 앉는다. */}
                    <div className="bleed-right mt-5 flex items-end text-[clamp(2.75rem,6.5vw,5.25rem)]">
                      {/* tabular-nums — 카운트업 중 자릿수 폭이 흔들리지 않게 한다. */}
                      <dd className="font-sans leading-[0.95] font-bold tracking-[-0.04em] text-accent tabular-nums">
                        <CountUp to={stat.value} suffix={stat.suffix} />
                      </dd>
                      <span
                        aria-hidden
                        className="mb-[0.14em] ml-[0.4em] h-px flex-1 bg-gradient-to-r from-accent/55 via-white/16 to-white/12"
                      />
                    </div>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
