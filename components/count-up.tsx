"use client";

import { useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { CountingNumber } from "@/components/ui/counting-number";

type Props = {
  to: number;
  suffix?: string;
  /** ms */
  duration?: number;
};

/**
 * 뷰포트에 들어오면 0에서 목표 숫자까지 센다.
 * motion 기반 CountingNumber를 스크롤 진입 시점에만 실행하고,
 * 모션 최소화 사용자에게는 애니메이션 없이 최종값만 보여준다.
 */
export default function CountUp({ to, suffix = "", duration = 1600 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();

  return (
    <span ref={ref}>
      {reduce ? (
        to.toLocaleString("ko-KR")
      ) : (
        <CountingNumber
          target={to}
          autoStart={inView}
          transition={{ duration: duration / 1000, ease: "easeOut", type: "tween" }}
        />
      )}
      {suffix}
    </span>
  );
}
