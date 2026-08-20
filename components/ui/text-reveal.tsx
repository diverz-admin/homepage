"use client";

import { FC, ReactNode, useEffect, useRef } from "react";
import { motion, MotionValue, useMotionValue, useTransform } from "framer-motion";

import { cn } from "@/lib/utils";

interface TextRevealByWordProps {
  text: string;
  className?: string;
  /** 리빌 문장 위에 고정으로 표시되는 라벨(예: 섹션 이름) */
  eyebrow?: ReactNode;
  /** 리빌 문장 아래에 고정으로 표시되는 보조 문구 */
  footer?: ReactNode;
}

const TextRevealByWord: FC<TextRevealByWordProps> = ({
  text,
  className,
  eyebrow,
  footer,
}) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  // 스크롤 진행도를 직접 계산해 MotionValue로 관리한다.
  // framer의 useScroll({target})은 히어로 영상/폰트 로딩으로 레이아웃이 밀리면
  // target 위치를 재측정하지 못해 진행도가 어긋나므로, 매 스크롤마다
  // getBoundingClientRect로 "고정 구간"을 [0,1]에 직접 매핑한다.
  const progress = useMotionValue(0);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight; // 텍스트가 고정된 채 스크롤되는 길이
      const p = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
      progress.set(p);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [progress]);

  // "\n"으로 문단(줄)을 나누고, 각 줄 안에서는 단어 단위로 리빌한다.
  // 리빌 인덱스는 줄을 넘어 연속되도록 전역 커서를 쓴다.
  // "**강조**"로 감싼 구간은 강조색으로 렌더한다(parseLine 참고).
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const wordsPerLine = lines.map(parseLine);
  const totalWords = wordsPerLine.reduce((sum, w) => sum + w.length, 0);
  let wordCursor = 0;

  return (
    <div ref={targetRef} className={cn("relative z-0 h-[150vh]", className)}>
      <div className="sticky top-0 mx-auto flex h-screen max-w-5xl flex-col items-center justify-center bg-transparent px-6 text-center">
        {eyebrow}
        {/* 글자 크기를 뷰포트 폭에 비례(vw)시켜 넓은 화면에서는 문단이 한 줄에
            들어간다. 좁은 화면은 그 크기로 한 줄에 다 안 들어가므로 억지로
            줄이는 대신(글자가 너무 작아진다) 자연스럽게 다음 줄로 접는다. */}
        <div className="flex flex-col items-center gap-y-1 text-[clamp(1.35rem,4.2vw,2.2rem)] leading-tight text-white/15 md:gap-y-2">
          {wordsPerLine.map((lineWords, li) => (
            <p key={li} className="flex flex-wrap justify-center gap-y-1">
              {lineWords.map((word) => {
                const i = wordCursor++;
                // 고정 구간(progress 0→1) 중 앞쪽 90%에서 리빌을 끝내고,
                // 남은 0.9~1.0 구간에는 전체 문장이 흰색으로 머문 채 보이도록 한다.
                const SPAN = 0.9;
                const start = (i / totalWords) * SPAN;
                const end = start + (1 / totalWords) * SPAN;
                return (
                  <Word
                    key={i}
                    progress={progress}
                    range={[start, end]}
                    highlight={word.highlight}
                  >
                    {word.text}
                  </Word>
                );
              })}
            </p>
          ))}
        </div>
        {footer}
      </div>
    </div>
  );
};

/**
 * 한 줄을 "**강조**" 마커 기준으로 나눠 단어 배열로 만든다.
 * 마커 안쪽은 강조색(Word의 highlight)으로 렌더된다.
 * 예: "브랜드의 **핵심 가치**를 찾는다" → 일반 2단어 + 강조 2단어 + 일반 1단어.
 */
function parseLine(line: string): { text: string; highlight: boolean }[] {
  return line
    .split(/(\*\*.+?\*\*)/g)
    .filter(Boolean)
    .flatMap((part) => {
      const isHighlight = part.startsWith("**") && part.endsWith("**");
      const clean = isHighlight ? part.slice(2, -2) : part;
      return clean
        .split(" ")
        .filter(Boolean)
        .map((text) => ({ text, highlight: isHighlight }));
    });
}

interface WordProps {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
  highlight?: boolean;
}

const Word: FC<WordProps> = ({ children, progress, range, highlight }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  // 강조 구간은 가장 굵게(extrabold)+강조색, 나머지는 semibold+흰색으로 대비를 준다.
  const weight = highlight ? "font-extrabold" : "font-semibold";
  return (
    <span className="relative mx-[0.15em]">
      <span
        className={cn("absolute opacity-20", weight, highlight && "text-accent-soft")}
      >
        {children}
      </span>
      <motion.span
        style={{ opacity: opacity }}
        className={cn(weight, highlight ? "text-accent-soft" : "text-white")}
      >
        {children}
      </motion.span>
    </span>
  );
};

export { TextRevealByWord };
