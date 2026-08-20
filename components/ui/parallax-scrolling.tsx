"use client";

import Image from "next/image";
import GradientLine from "@/components/gradient-line";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/**
 * 스크롤에 따라 깊이가 갈리는 패럴랙스 히어로.
 *
 * 원본(Osmo)은 투명 배경으로 미리 잘라둔 레이어 이미지 3장을 겹쳤는데,
 * 여기 소스는 잘리지 않은 사진 한 장이라 레이어를 직접 구성했다.
 *  1 — 사진 전체 (가장 뒤, 가장 많이 밀린다)
 *  2 — 수면에서 내려오는 광선 (반투명 오버레이)
 *  3 — 타이틀
 *  4 — 같은 사진의 아래쪽 산호를 마스크로 떠낸 전경 (거의 안 움직인다)
 *
 * yPercent는 "제 높이의 %"라서 레이어 크기를 바꾸면 이동량이 통째로 달라진다.
 * 레이어를 뷰포트의 150%로 잡아 위아래 25%씩 여유를 두고, 이동량이 그 여유를
 * 넘지 않는 선(최대 15%×150% = 22.5vh)에서 원본의 원근 순서만 지켰다.
 * 값을 키우려면 레이어 높이(--layer-h)도 같이 키워야 빈틈이 안 생긴다.
 *
 * 영상(레이어1)은 사진과 박스 크기가 다르다: object-cover 확대율은
 * "박스 높이 ÷ 원본 높이"로 정해지는데, 박스가 150%(뷰포트의 1.5배)로 크면
 * 16:9 영상은 세로 기준으로 맞춰지며 좌우가 크게 잘려 "너무 확대된" 것처럼
 * 보인다. 영상일 때만 박스를 115%로 낮춰 확대율을 줄이고, 줄어든 여유
 * (7.5vh)를 넘지 않게 이동량도 같이 낮춘다(5%×115% ≈ 5.75vh).
 */

const IMAGE_LAYERS = [
  { layer: "1", yPercent: 15 },
  { layer: "2", yPercent: 11 },
  { layer: "3", yPercent: 7 },
  { layer: "4", yPercent: 2 },
] as const;

const VIDEO_LAYERS = [
  { layer: "1", yPercent: 5 },
  { layer: "2", yPercent: 11 },
  { layer: "3", yPercent: 7 },
  { layer: "4", yPercent: 2 },
] as const;

type Props = {
  /** 배경 사진 경로. videoSrc가 있어도 전경(레이어4) 마스크 크롭은 이 사진을 쓴다. */
  src: string;
  /**
   * 넘기면 레이어1(가장 뒤, 전체 배경)이 사진 대신 무음 반복 영상이 된다.
   * 전경(레이어4)은 영상 프레임을 마스크로 오려낼 수 없어 계속 정지 사진(src)을 쓴다.
   */
  videoSrc?: string;
  /** 큰 슬로건 두 줄. */
  slogan: readonly [string, string];
  /** 슬로건 아래 보조 카피. "\n"으로 줄을 나눈다. */
  tagline: string;
};

export default function ParallaxHero({ src, videoSrc, slogan, tagline }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    // 모션 최소화 사용자에게는 스크롤을 가로채지도, 레이어를 밀지도 않는다.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // 모바일도 마찬가지로 끈다. 히어로 영상을 자동재생하며 매 스크롤
    // 프레임마다 레이어 4장을 GSAP로 같이 옮기면(+Lenis 관성) 저사양
    // 기기에서 스크롤이 버벅인다 — 특히 히어로를 벗어나는 순간 티가 난다.
    // 데스크톱 전용 장식이라 꺼도 내용 손실이 없고, CSS(.parallax의
    // 640px 미만 규칙)가 무대를 100svh 고정 히어로로 접어 둔다.
    if (window.matchMedia("(max-width: 639px)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    // Lenis 관성 스크롤. rAF는 GSAP ticker에 얹어 두 개의 루프가 돌지 않게 한다.
    const lenis = new Lenis();
    const onScroll = () => ScrollTrigger.update();
    const raf = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", onScroll);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // context로 묶어 여기서 만든 트리거/트윈만 정리한다.
    // (원본은 ScrollTrigger.getAll()을 전부 kill 해서 남의 트리거까지 죽였다.)
    const ctx = gsap.context(() => {
      const stage = root.querySelector("[data-parallax-layers]");
      if (!stage) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          // 트리거는 키 큰 바깥 섹션이다. 안쪽 레이어는 sticky라
          // 트리거로 삼으면 start/end 계산이 어긋난다.
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: 0,
        },
      });

      const layers = videoSrc ? VIDEO_LAYERS : IMAGE_LAYERS;
      layers.forEach(({ layer, yPercent }, i) => {
        tl.to(
          stage.querySelectorAll(`[data-parallax-layer="${layer}"]`),
          { yPercent, ease: "none" },
          i === 0 ? undefined : "<"
        );
      });
    }, rootRef);

    return () => {
      ctx.revert();
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(raf);
      // 전역 설정이라 원래대로 돌려놓는다. 안 그러면 이 페이지를 떠난 뒤에도
      // 다른 GSAP 애니메이션이 lagSmoothing 없이 돈다.
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, [videoSrc]);

  return (
    /* 키를 키워 스크럽 구간을 만든다. 안쪽 무대는 sticky로 한 화면에 붙는다. */
    <div
      ref={rootRef}
      id="site-hero"
      className="parallax relative h-[220svh] bg-abyss"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div
          data-parallax-layers
          /* 레이어들이 겹쳐 앉는 무대. 각 레이어는 뷰포트의 150%라
             위아래로 25%씩 여유가 있고, 그 안에서만 밀린다. */
          className="absolute inset-0"
        >
          {/* 1 — 배경 전체. videoSrc가 있으면 무음 반복 영상, 없으면 사진.
              영상 박스는 150%가 아니라 115% — 위 주석 참고. */}
          <div
            data-parallax-layer="1"
            className={
              videoSrc
                ? "absolute inset-x-0 -top-[7.5%] h-[115%]"
                : "absolute inset-x-0 -top-1/4 h-[150%]"
            }
          >
            {videoSrc ? (
              <>
                <video
                  src={videoSrc}
                  poster={src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="hero-photo absolute inset-0 h-full w-full object-cover"
                />
                {/* 어둡게 깔아 위 카피 대비를 지킨다. */}
                <div aria-hidden className="absolute inset-0 bg-abyss/65" />
              </>
            ) : (
              <Image
                src={src}
                alt=""
                fill
                priority
                sizes="100vw"
                className="hero-photo object-cover"
              />
            )}
          </div>

          {/* 2 — 수면에서 내려오는 광선. 사진 위에 얹는 빛이라 screen으로 섞는다. */}
          <div
            data-parallax-layer="2"
            aria-hidden
            className="hero-rays absolute inset-x-0 -top-1/4 h-[150%] mix-blend-screen"
          />

          {/* 3 — 타이틀 */}
          <div
            data-parallax-layer="3"
            className="absolute inset-x-0 -top-1/4 flex h-[150%] items-center"
          >
            {/* 글자 뒤 스크림. 물 위로 카피가 얹히면 대비가 무너져서 눌러 준다.
                타이틀과 같은 레이어라 함께 밀린다. */}
            <div aria-hidden className="hero-scrim absolute inset-0" />

            {/* 슬로건 아래에 보조 카피를 바로 이어 붙여, 화면 크기와 무관하게
                항상 세로로 쌓고 가운데 정렬한다. */}
            <div className="relative page-container">
              {/* 부모(레이어3)가 items-center라 여기 그대로 두면 뷰포트 정가운데다. */}
              <div className="flex w-full flex-col items-center gap-8">
                {/* GradientLine은 이제 색을 입히지 않고 줄만 끊는다.
                    글자색은 여기(부모)에서 정한다. */}
                <h1 className="text-center font-sans text-fluid-hero leading-[1.15] font-bold tracking-tight text-white drop-shadow-[0_4px_30px_rgb(5_8_16_/_0.75)]">
                  <GradientLine>{slogan[0]}</GradientLine>
                  <GradientLine>{slogan[1]}</GradientLine>
                </h1>
                <p
                  /* globals.css의 `p { line-height: 1.7 }`가 레이어 밖이라
                     leading-* 유틸리티를 이긴다 — 행간은 인라인으로 준다. */
                  style={{ lineHeight: 1.5 }}
                  className="max-w-md text-center break-keep whitespace-pre-line text-fluid-lg font-semibold text-accent drop-shadow-[0_2px_14px_rgb(5_8_16_/_0.95)]"
                >
                  {tagline}
                </p>
              </div>
            </div>
          </div>

          {/* 4 — 전경 산호. 같은 사진의 아래쪽만 마스크로 떠내 앞으로 세운다.
                 거의 안 움직여서 뒤 레이어와 시차가 가장 크게 벌어진다. */}
          <div
            data-parallax-layer="4"
            aria-hidden
            className="hero-foreground absolute inset-x-0 -top-1/4 h-[150%]"
          >
            <Image
              src={src}
              alt=""
              fill
              priority
              sizes="100vw"
              className="hero-photo object-cover object-bottom"
            />
          </div>
        </div>

        {/* 아래로 갈수록 심해로 잠겨 다음 섹션과 이음새 없이 붙는다.
            높이를 절반까지 키운 건, 무대가 빠져나가는 구간이 짧아서
            페이드가 얕으면 경계가 선으로 드러나기 때문이다. */}
        <div
          aria-hidden
          className="hero-fade pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
        />
      </div>
    </div>
  );
}
