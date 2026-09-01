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
  /**
   * 이 탭이 놓인 바닥의 밝기.
   *
   * "light"(기본) — 흰 지면(.on-light)용. 알약은 남색 그라디언트에 흰 글자다.
   * "dark" — 어두운 지면(WORK 등)용. 남색 알약은 어두운 바탕에 묻혀
   *   "지금 이 탭"이 안 읽히므로, 지면에서 가장 밝은 값(#acd4ff)을 통째로
   *   채우고 글자를 뒤집는다. 안 눌린 탭도 흰색을 옅게 깔아 둔다 —
   *   text-foreground 는 어두운 지면에서 이미 밝지만, 알약과의 대비를
   *   확실히 벌리려면 한 단계 더 눌러야 한다.
   */
  tone?: "light" | "dark";
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
  tone = "light",
  className,
}: ChipTabsProps) {
  const [uncontrolled, setUncontrolled] = useState(tabs[0]?.id);
  const active = selected ?? uncontrolled;
  const reduceMotion = useReducedMotion();

  return (
    // w-fit + mx-auto — 탭 묶음을 감싼 블록을 가운데로 보낸다(inline-flex
    // 그대로면 부모가 block이어도 mx-auto가 안 먹는다). 트랙 배경·테두리는
    // 걷었다 — 선택 탭의 알약(그라디언트)만으로 상태가 구분된다.
    <div
      className={cn(
        "mx-auto flex w-fit flex-wrap items-center gap-1 p-1.5",
        className,
      )}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        const shared = {
          onClick: () => {
            setUncontrolled(tab.id);
            onSelect?.(tab.id);
          },
          className: cn(
            // 본문 폰트(Pretendard) 볼드 + 좁은 자간. rounded-full —
            // 트랙과 알약이 같은 반경이어야 알약이 트랙에 꼭 맞는 조각으로
            // 보인다(예전엔 버튼 rounded-lg, 알약 rounded-md로 서로 달랐다).
            "relative rounded-full px-5 py-2.5 text-sm font-bold tracking-[-0.02em] transition-colors sm:text-base",
            // 활성 탭은 알약 위 글자다 — 알약 색에 맞춰 뒤집는다.
            isActive
              ? tone === "dark"
                ? "text-abyss"
                : "text-white"
              : tone === "dark"
                ? "text-white/55 hover:text-white"
                : "text-foreground/60 hover:text-foreground",
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
                className={cn(
                  "absolute inset-0 z-0 rounded-full",
                  tone === "dark"
                    ? "bg-[#acd4ff]"
                    : "bg-gradient-to-r from-deep to-mid",
                )}
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
