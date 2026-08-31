"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

type Props = {
  /** 1단계 — 화면을 꽉 채우는 질문. "\n"으로 줄을 나눈다. */
  question: string;
  /** 2단계 — 굵게 남는 문단들. */
  body: readonly string[];
  /** 2단계 아래, 한 톤 낮춰 붙는 마무리 문단. */
  outro: string;
  /** 질문 위에 작게 얹는 라벨. 이 지면이 무엇인지 알려 준다. */
  label: string;
};

/**
 * 채용 지면 히어로 — 배경은 화면에 붙어 있고 문구만 갈린다.
 * (toss.im/career/culture 첫 화면 참고.)
 *
 * 섹션을 화면 두 개 높이로 잡고, 안쪽 상자를 sticky로 화면에 붙인다.
 * 남는 한 화면 높이만큼 스크롤하는 동안 배경은 그 자리에 서 있고,
 * 그 위의 문구만 1단계 → 2단계로 바뀐다. 2단계에서는 배경을 더 눌러
 * 어둡게 깔아 글이 길어져도 읽힌다.
 *
 * 스크롤 리스너를 달지 않는다. 화면에 안 그리는 표식(sentinel) 두 개를
 * 뷰포트 한가운데 선(rootMargin -50%/-50%)으로 관찰해, 어느 표식이 그 선을
 * 지나고 있는지로만 단계를 정한다 — rAF 없이 브라우저가 알아서 알려 준다.
 */
export default function RecruitHero({ question, body, outro, label }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const marks = root.querySelectorAll<HTMLElement>("[data-stage]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setStage(Number(entry.target.getAttribute("data-stage")));
        }
      },
      // 위아래를 50%씩 깎아 뷰포트 한가운데 "선"만 남긴다.
      { rootMargin: "-50% 0px -50% 0px" }
    );

    marks.forEach((mark) => observer.observe(mark));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={rootRef} className="relative h-[200svh]">
      {/* 단계 표식 — 폭 0, 화면에 아무것도 그리지 않는다. */}
      <span
        aria-hidden
        data-stage="0"
        className="pointer-events-none absolute top-0 h-[100svh] w-px"
      />
      <span
        aria-hidden
        data-stage="1"
        className="pointer-events-none absolute top-[100svh] h-[100svh] w-px"
      />

      <div className="sticky top-0 h-[100svh] overflow-hidden bg-abyss">
        {/* 소리 없는 장식용 루프. poster는 첫 프레임이라 로드 전에도 같은 그림이다. */}
        <video
          src="/videos/diving.mp4"
          poster="/videos/diving-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* 기본 스크림 — 1단계의 흰 제목이 어디에 놓여도 읽히게 한다.
            영상 가운데를 가로지르는 조명 줄기가 밝아서, 45%로는 그 위에
            얹힌 글자가 흐려졌다. */}
        <div aria-hidden className="absolute inset-0 bg-abyss/62" />
        {/* 2단계에서 한 겹 더 눌러 어둡게 만든다. 실제로 깔리는 어둠은 두
            겹을 합친 값이라(0.62 + 0.64×0.38 ≈ 0.86), 기본 스크림을 올린
            만큼 이 값은 내려 2단계가 통째로 검게 죽지 않게 한다. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-abyss transition-opacity duration-700 ease-out"
          style={{ opacity: stage === 1 ? 0.64 : 0 }}
        />

        <div className="relative grid h-full place-items-center px-6">
          {/* 두 단계를 같은 칸에 겹쳐 두고 투명도로만 갈아 끼운다.
              (col-start-1/row-start-1 — grid 한 칸에 포개는 방법) */}
          <div
            className="col-start-1 row-start-1 text-center transition-all duration-700 ease-out"
            style={{
              opacity: stage === 0 ? 1 : 0,
              transform: stage === 0 ? "none" : "translateY(-1.5rem)",
            }}
            // 사라진 쪽은 스크린리더와 탭 이동에서도 빠진다.
            aria-hidden={stage !== 0}
          >
            <p className="font-display text-xs font-bold tracking-[0.28em] text-white/60">
              {label}
            </p>
            <h1 className="mt-7 break-keep font-display text-[clamp(1.9rem,5.6vw,4.25rem)] leading-[1.28] font-bold tracking-tight text-white">
              {question.split("\n").map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h1>
          </div>

          <div
            className="col-start-1 row-start-1 max-w-2xl text-center transition-all duration-700 ease-out"
            style={{
              opacity: stage === 1 ? 1 : 0,
              transform: stage === 1 ? "none" : "translateY(1.5rem)",
            }}
            aria-hidden={stage !== 1}
          >
            <div className="space-y-7">
              {body.map((paragraph, i) => (
                <p
                  key={i}
                  className="break-keep font-display text-fluid-lg leading-relaxed font-bold text-white sm:whitespace-pre-line"
                >
                  {paragraph}
                </p>
              ))}
            </div>
            {/* 마무리는 한 톤 낮춘다 — 위 문장들이 묻지 않게. */}
            <p className="mt-10 break-keep text-fluid-lg leading-relaxed text-white/55 sm:whitespace-pre-line">
              {outro}
            </p>
          </div>
        </div>

        {/* 아래로 더 있다는 표시. 2단계에서는 할 일이 끝나 사라진다. */}
        <ChevronDown
          aria-hidden
          className="absolute bottom-8 left-1/2 h-7 w-7 -translate-x-1/2 text-white/50 transition-opacity duration-500"
          style={{ opacity: stage === 0 ? 1 : 0 }}
        />
      </div>
    </section>
  );
}
