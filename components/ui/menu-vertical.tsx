"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type MenuItem = {
  label: string;
  href: string;
};

interface MenuVerticalProps {
  menuItems: MenuItem[];
  /** 호버 시 글자·화살표 색. */
  color?: string;
  skew?: number;
  /** 왼쪽 화살표를 보일지. 끄면 라벨 슬라이드 폭도 함께 줄인다. */
  showArrow?: boolean;
  className?: string;
  /** 라벨에 얹을 클래스(폰트·크기 등). */
  itemClassName?: string;
  /** href가 일치하는 항목을 호버 상태(색·위치)로 고정한다. 스크롤 스파이용. */
  activeHref?: string;
}

const MotionLink = motion.create(Link);

/**
 * 세로 메뉴. 호버하면 항목이 옆으로 밀리며 색이 바뀐다.
 *
 * 원본(menu-vertical)에서 바꾼 것:
 *  - `showArrow`를 추가했다. 화살표를 끄면 라벨의 초기 x를 -40에서 0으로
 *    바꾼다. 원본의 -40은 화살표가 차지하던 자리를 메우려는 값이라,
 *    화살표만 지우면 글자가 왼쪽에서 튀어나오는 것처럼 보인다.
 *  - `className` / `itemClassName`을 열었다. 원본은 px-10과 text-4xl이
 *    박혀 있어 페이지 여백·타이포에 맞출 수 없다.
 *  - 색은 prop으로 받는다(기본값 #ff6900은 이 사이트와 무관한 주황).
 */
export const MenuVertical = ({
  menuItems = [],
  color = "#ff6900",
  skew = 0,
  showArrow = true,
  className,
  itemClassName,
  activeHref,
}: MenuVerticalProps) => {
  return (
    <nav className={cn("flex w-fit flex-col gap-4", className)}>
      {menuItems.map((item, index) => {
        // 활성 항목은 호버와 같은 variant("hover")로 고정한다.
        // whileHover는 그 위에 그대로 얹혀서, 다른 항목을 호버해도 정상 동작한다.
        const isActive = item.href === activeHref;
        return (
          <motion.div
            key={`${item.href}-${index}`}
            className="group/nav flex cursor-pointer items-center gap-2 text-foreground"
            initial="initial"
            animate={isActive ? "hover" : "initial"}
            whileHover="hover"
          >
            {showArrow && (
              <motion.div
                aria-hidden
                variants={{
                  initial: { x: "-100%", color: "inherit", opacity: 0 },
                  hover: { x: 0, color, opacity: 1 },
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="z-0"
              >
                <ArrowRight strokeWidth={3} className="size-10" />
              </motion.div>
            )}

            <MotionLink
              href={item.href}
              variants={{
                initial: { x: showArrow ? -40 : 0, color: "inherit" },
                hover: { x: showArrow ? 0 : 12, color, skewX: skew },
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={cn("text-4xl font-semibold no-underline", itemClassName)}
            >
              {item.label}
            </MotionLink>
          </motion.div>
        );
      })}
    </nav>
  );
};

export default MenuVertical;
