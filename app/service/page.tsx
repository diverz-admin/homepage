import type { Metadata } from "next";
import GradientLine from "@/components/gradient-line";
import PageHero from "@/components/page-hero";
import GlobalShowcase from "@/components/global-showcase";
import LogoOrbit from "@/components/logo-orbit";
import PerformanceFunnel from "@/components/performance-funnel";
import PerformanceLogoGrid from "@/components/performance-logo-grid";
import Reveal from "@/components/reveal";
import ServiceSection from "@/components/service-section";
import ViralChannels from "@/components/viral-channels";
import FlowArt, { FlowSection } from "@/components/ui/story-scroll";
import { imcProcess, services } from "@/lib/site";

export const metadata: Metadata = {
  title: "SERVICE",
  description:
    "IMC 마케팅, 퍼포먼스 마케팅, 바이럴, 글로벌 마케팅, 콘텐츠. 브랜드에 필요한 실행을 한 팀에서 통합해 운영합니다.",
};

/**
 * 히어로 상단에서 돌아가는 서비스명(영문).
 * lib/site.ts의 services에서 파생하지 않는다 — 표기가 국문이라 그대로 못 쓴다.
 */
const heroServices = [
  "IMC Marketing",
  "Contents",
  "Viral",
  "Performance Marketing",
  "Global Marketing",
] as const;

/**
 * 서비스 5종의 패널 색. services 배열과 순서가 1:1로 맞는다.
 *
 * 수면(흰색)에서 심연(네이비)으로 한 칸씩 내려간다 — 사이트 전체가 쓰는
 * 수심 컨셉을 그대로 서비스 순서에 얹은 것이라, 아래로 스크롤할수록
 * 깊이 들어가는 인상이 난다.
 *
 * tone은 배경이 밝은지 어두운지다. 밝은 패널에는 .on-light를 씌워 색 역할
 * 토큰(foreground/accent/line)을 통째로 뒤집으므로, 안쪽 컴포넌트는
 * text-foreground 같은 토큰만 쓰면 양쪽에서 다 맞는다.
 */
const panels = [
  { bg: "#ffffff", tone: "light" },
  { bg: "var(--ocean-surface)", tone: "light" },
  // shallow(#a8c0da)는 밝지도 어둡지도 않은 중간값이라, 본문(foreground/60)
  // 대비가 2.9:1까지 떨어져 글씨가 묻혔다. surface와 shallow 사이의
  // 밝은 톤으로 한 칸 올린다 — 수심이 내려가는 흐름은 그대로 두면서
  // 본문 대비는 4.6:1까지 회복된다.
  { bg: "#dbe4f0", tone: "light" },
  { bg: "var(--ocean-deep)", tone: "dark" },
  { bg: "var(--ocean-abyss)", tone: "dark" },
] as const;

/**
 * 서비스 5종을 전체 화면 패널로 하나씩 쌓는다.
 *
 * 이전에는 왼쪽 sticky 세로 메뉴 + 오른쪽에 5종을 세로로 이어 붙인 한 장이라
 * 어디서 상품이 바뀌는지 눈에 안 잡혔다. 지금은 패널마다 배경색이 다르고,
 * 다음 패널이 기울어진 채 들어와 앞 패널을 덮으며 펴진다
 * (components/ui/story-scroll.tsx).
 *
 * sticky 메뉴는 뺐다 — 화면에 고정(pin)되는 전체 화면 패널과 같이 두면
 * 자리를 잡을 수 없다. 대신 패널마다 "01 IMC MARKETING"처럼 번호와 이름이
 * 제목으로 붙는다. `#slug` 앵커는 그대로라 외부 링크는 계속 동작한다.
 */
export default function ServicePage() {
  return (
    <>
      {/* who-we-are와 같은 히어로. 패널 흐름 바깥에 둔다. */}
      <PageHero
        title={
          <>
            <GradientLine>브랜드와 고객이 만나는</GradientLine>
            <GradientLine>모든 접점을 설계합니다</GradientLine>
          </>
        }
        description={
          "다이버즈는 온라인과 오프라인, 검색과 콘텐츠, 리뷰와 광고를\n" +
          "하나의 흐름으로 연결하는 통로를 설계합니다.\n" +
          "브랜드가 고객에게 발견되는 순간부터 신뢰를 얻고 선택되는 과정까지,\n" +
          "각 채널의 역할을 전략적으로 설계하고 실행합니다."
        }
        typed={{ texts: heroServices }}
      />

      <FlowArt aria-label="다이버즈 서비스">
        {services.map((service, i) => {
          const panel = panels[i];
          // IMC·퍼포먼스·바이럴은 딸린 블록(프로세스 타임라인·성과 곡선·
          // 채널 목록)이 있어 패널 하나를 넘긴다. 나머지 둘은 본문만 있어서
          // 위로 붙이면 화면 아래 절반이 통째로 빈다 — 그래서 가운데로 모은다.
          const centered = !["imc", "performance", "viral"].includes(
            service.slug
          );
          return (
            <FlowSection
              key={service.slug}
              aria-label={service.name}
              className={panel.tone === "light" ? "on-light" : undefined}
              style={{
                backgroundColor: panel.bg,
                color: "var(--foreground)",
                // 헤더가 fixed(h-20)로 모든 패널 위에 떠 있어서, 패널마다
                // 그만큼 위를 비워 둬야 제목이 가리지 않는다.
                paddingTop: "7rem",
                // FlowSection 기본값(px-4vw)은 좁아서 내용이 화면 끝에 붙는다.
                // 클래스로는 못 덮으므로(같은 속성이라 순서가 보장 안 된다)
                // 여기서 인라인으로 준다.
                paddingInline: "clamp(1.5rem, 10vw, 14rem)",
                ...(centered ? { justifyContent: "center" } : null),
              }}
            >
              <div className="mx-auto w-full max-w-[1800px]">
                <ServiceSection
                  service={service}
                  index={i}
                  tone={panel.tone}
                  /* IMC는 로고 궤도, 퍼포먼스는 채널 로고 3x2 그리드,
                     글로벌은 샤오홍슈 노출 사례 사진을 오른쪽에 세운다. */
                  aside={
                    service.slug === "imc" ? (
                      <LogoOrbit />
                    ) : service.slug === "performance" ? (
                      <PerformanceLogoGrid />
                    ) : service.slug === "global" ? (
                      <GlobalShowcase />
                    ) : undefined
                  }
                >
                  {/* 퍼포먼스 마케팅 전용 화이트 카드 — 강점 3가지 + 성과 곡선. */}
                  {service.slug === "performance" && <PerformanceFunnel />}

                  {/* 바이럴 채널 3종 + 상위노출 2종. */}
                  {service.slug === "viral" && <ViralChannels />}

                  {/* IMC 6단계는 IMC에 속한 내용이라 그 블록 안에 둔다. */}
                  {service.slug === "imc" && (
                    <div className="mt-16">
                      <Reveal>
                        <div className="flex items-center gap-4">
                          <p className="font-display text-xs font-bold tracking-[0.25em] text-accent">
                            IMC PROCESS
                          </p>
                          <span
                            aria-hidden
                            className="h-px flex-1 bg-foreground/10"
                          />
                        </div>
                      </Reveal>

                      {/* 모바일 전용 세로 타임라인. 가로 지그재그 버전은 min-w가
                          커서 좁은 화면에선 옆으로 긁어야만 다음 단계를 볼 수
                          있었다 — 한 번에 안 읽혀서 sm 미만은 이쪽으로 대체한다. */}
                      <div className="mt-12 space-y-8 sm:hidden">
                        {imcProcess.map((step, stepIndex) => (
                          <Reveal
                            key={step.no}
                            delay={stepIndex * 60}
                            className="flex gap-4"
                          >
                            <div className="flex flex-col items-center">
                              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-soft to-abyss font-display text-[0.7rem] font-bold text-white">
                                {step.no}
                              </span>
                              {stepIndex < imcProcess.length - 1 && (
                                <span
                                  aria-hidden
                                  className="mt-1 w-px flex-1 bg-foreground/15"
                                />
                              )}
                            </div>
                            <div className="pb-2">
                              <h3 className="text-base font-bold break-keep text-foreground">
                                {step.title}
                              </h3>
                              <p className="mt-1.5 text-[0.85rem] leading-snug break-keep text-foreground/55">
                                {step.body}
                              </p>
                            </div>
                          </Reveal>
                        ))}
                      </div>

                      {/* 가로 흐름 바 타임라인(sm 이상). 01·03·05는 바 위, 02·04·06은
                          바 아래로 지그재그 배치하고, 바 자체는 다이버즈 블루
                          스케일(연한 accent → mid → abyss)로 흘려 깊이감을 준다.
                          6단이 한 줄에 다 들어가지 않는 화면은 옆으로 스크롤한다. */}
                      {/* 그래프만 살짝 좁혀 가운데로 모은다. 위의 "IMC PROCESS" 줄은
                          블록 폭을 그대로 쓴다. min-w-[880px]가 남아 있어
                          좁은 화면에서는 여전히 가로로 스크롤한다. */}
                      <div className="mx-auto mt-12 hidden w-[90%] overflow-x-auto pb-2 sm:block">
                        <div className="relative min-w-[960px]">
                          <div
                            aria-hidden
                            className="absolute inset-x-3 top-1/2 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-accent-soft via-mid to-abyss"
                          />
                          <div className="relative grid grid-cols-6">
                            {imcProcess.map((step, stepIndex) => {
                              const above = stepIndex % 2 === 0;
                              const content = (
                                <>
                                  <span className="font-display text-[0.8rem] font-bold tracking-[0.15em] text-accent">
                                    {step.no}
                                  </span>
                                  <h3 className="mt-1.5 text-base font-bold break-keep text-foreground">
                                    {step.title}
                                  </h3>
                                  <p className="mt-1.5 text-[0.85rem] leading-snug break-keep text-balance text-foreground/55">
                                    {step.body}
                                  </p>
                                </>
                              );
                              return (
                                <Reveal
                                  key={step.no}
                                  delay={stepIndex * 60}
                                  className="flex flex-col items-center px-3"
                                >
                                  <div
                                    className={`flex min-h-28 flex-col items-center justify-end pb-3 text-center ${above ? "" : "invisible"}`}
                                  >
                                    {content}
                                  </div>
                                  <span
                                    aria-hidden
                                    className="h-3 w-px bg-foreground/25"
                                  />
                                  <div
                                    className={`flex min-h-28 flex-col items-center justify-start pt-3 text-center ${above ? "invisible" : ""}`}
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
                  )}
                </ServiceSection>
              </div>
            </FlowSection>
          );
        })}
      </FlowArt>
    </>
  );
}
