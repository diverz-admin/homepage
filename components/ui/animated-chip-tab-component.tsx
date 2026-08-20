"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type ChipTab = {
  id: string;
  label: string;
  /**
   * 있으면 <a>로 렌더한다. 앵커 이동·키보드·새 탭 열기가 그대로 동작하고
   * JS가 없어도 링크로 남는다. 없으면 원본처럼 버튼이 된다.
   */
  href?: string;
};

type ChipTabsProps = {
  tabs: ChipTab[];
  /** 넘기면 제어 컴포넌트가 된다(스크롤 위치 등 바깥 상태에 맞출 때). */
  selected?: string;
  onSelect?: (id: string) => void;
  /**
   * 알약이 이동하는 layout 애니메이션의 식별자.
   * 한 화면에 이 컴포넌트가 둘 이상이면 서로 알약을 주고받으므로 다르게 준다.
   */
  layoutId?: string;
  className?: string;
};

/**
 * 선택된 항목 아래로 알약이 미끄러져 오는 탭.
 *
 * 원본(animated-chip-tab-component)에서 바꾼 것:
 *  - `Chip`의 props에 타입이 없어(암묵적 any) strict 모드에서 컴파일되지 않았다.
 *  - 탭 목록이 컴포넌트 안에 하드코딩돼 있던 것을 prop으로 뺐다.
 *  - `selected`를 밖에서 제어할 수 있게 했다(스크롤 위치 연동용).
 *  - `href`를 받으면 <a>로 렌더한다. 버튼만 있으면 앵커 이동이 안 된다.
 *  - violet→indigo 그라디언트 → 다이버즈 블루. 흰 배경에 흰 글씨를 얹으므로
 *    밝은 쪽 끝을 accent(#38bdf8)가 아니라 mid(#2b7fc4)로 둔다. accent까지
 *    가면 알약 오른쪽에서 흰 글씨 대비가 2.2:1까지 떨어져 읽히지 않는다.
 *  - `hover:bg-slate-700` 같은 다크 전용 호버 → 팔레트 토큰.
 *  - layoutId를 prop으로. 원본은 "pill-tab" 고정이라 인스턴스가 둘이면 충돌한다.
 *  - 모션 최소화 설정에서는 알약이 미끄러지지 않고 즉시 바뀐다.
 */
export function ChipTabs({
  tabs,
  selected,
  onSelect,
  layoutId = "chip-tab-pill",
  className,
}: ChipTabsProps) {
  const [uncontrolled, setUncontrolled] = useState(tabs[0]?.id);
  const active = selected ?? uncontrolled;
  const reduceMotion = useReducedMotion();

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        const shared = {
          onClick: () => {
            setUncontrolled(tab.id);
            onSelect?.(tab.id);
          },
          className: cn(
            // 본문 폰트(Pretendard) 볼드 + 좁은 자간.
            "relative rounded-md px-4 py-2 text-base font-bold tracking-[-0.03em] transition-colors",
            // 활성 탭은 알약 위라 흰색을 유지해야 대비가 나온다.
            isActive ? "text-white" : "text-foreground/70 hover:text-foreground"
          ),
        };

        const inner = (
          <>
            <span className="relative z-10">{tab.label}</span>
            {isActive && (
              <motion.span
                layoutId={layoutId}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: "spring", duration: 0.5 }
                }
                className="absolute inset-0 z-0 rounded-md bg-gradient-to-r from-deep to-mid"
              />
            )}
          </>
        );

        return tab.href ? (
          <a
            key={tab.id}
            href={tab.href}
            aria-current={isActive ? "true" : undefined}
            {...shared}
          >
            {inner}
          </a>
        ) : (
          <button
            key={tab.id}
            type="button"
            aria-pressed={isActive}
            {...shared}
          >
            {inner}
          </button>
        );
      })}
    </div>
  );
}

export default ChipTabs;
