"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * 단어가 글자 단위로 흐려졌다 나타나며 교체되는 효과.
 *
 * 원본(flip-words)에서 고친 것:
 *  - `setTimeout`에 cleanup이 없었다. duration이 바뀌거나 언마운트될 때
 *    타이머가 남아 교체가 겹쳐 돈다. 정리 함수를 붙였다.
 *  - `useReducedMotion` 대응. 모션 최소화 설정이면 블러·이동 없이 바꾼다.
 *  - `words.indexOf(currentWord)`는 목록에 같은 단어가 두 번 있으면 순서가
 *    꼬인다. 인덱스를 state로 들고 돈다.
 *  - 교체 중 exit 요소가 `position: absolute`로 빠지므로 감싸는 쪽에
 *    `relative`가 필요하다. 컴포넌트 안에서 처리하도록 래퍼를 뒀다.
 */
export const FlipWords = ({
  words,
  duration = 3000,
  className,
}: {
  words: string[];
  duration?: number;
  className?: string;
}) => {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const reduceMotion = useReducedMotion();

  const startAnimation = useCallback(() => {
    setIndex((prev) => (prev + 1) % words.length);
    setIsAnimating(true);
  }, [words.length]);

  useEffect(() => {
    if (isAnimating) return;
    const timer = setTimeout(startAnimation, duration);
    return () => clearTimeout(timer);
  }, [isAnimating, duration, startAnimation]);

  const currentWord = words[index] ?? "";

  return (
    // exit 요소가 absolute로 빠지므로 기준 박스가 필요하다.
    <span className="relative inline-block">
      <AnimatePresence onExitComplete={() => setIsAnimating(false)}>
        <motion.span
          key={currentWord + index}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduceMotion
              ? { duration: 0.15 }
              : { type: "spring", stiffness: 100, damping: 10 }
          }
          exit={
            reduceMotion
              ? { opacity: 0, position: "absolute" }
              : {
                  opacity: 0,
                  y: -40,
                  x: 40,
                  filter: "blur(8px)",
                  scale: 2,
                  position: "absolute",
                }
          }
          className={cn("relative z-10 inline-block text-left", className)}
        >
          {currentWord.split(" ").map((word, wordIndex) => (
            <motion.span
              key={word + wordIndex}
              initial={{
                opacity: 0,
                y: reduceMotion ? 0 : 10,
                filter: reduceMotion ? "none" : "blur(8px)",
              }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                delay: reduceMotion ? 0 : wordIndex * 0.3,
                duration: reduceMotion ? 0.15 : 0.3,
              }}
              className="inline-block whitespace-nowrap"
            >
              {word.split("").map((letter, letterIndex) => (
                <motion.span
                  key={word + letterIndex}
                  initial={{
                    opacity: 0,
                    y: reduceMotion ? 0 : 10,
                    filter: reduceMotion ? "none" : "blur(8px)",
                  }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    delay: reduceMotion
                      ? 0
                      : wordIndex * 0.3 + letterIndex * 0.05,
                    duration: reduceMotion ? 0.15 : 0.2,
                  }}
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              ))}
              {/* 단어 사이 공백. inline-block 글자들 사이라 필요하다. */}
              <span className="inline-block">&nbsp;</span>
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default FlipWords;
