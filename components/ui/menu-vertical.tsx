"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

import Link from "next/link";

type MenuItem = {
  label: string;
  href: string;
};

interface MenuVerticalProps {
  menuItems: MenuItem[];
  color?: string;
  skew?: number;
  /**
   * 현재 보고 있는 항목의 href. 그 항목은 호버하지 않아도 hover 상태로
   * 고정된다(화살표가 나와 있고 글자가 밀린 채 색이 켜진 상태).
   * 원본에는 없던 값 — 상품마다 페이지가 따로라 "지금 어디" 표시가 필요하다.
   */
  activeHref?: string;
  /**
   * false면 이동해도 스크롤 위치를 그대로 둔다(Next Link의 기본은 맨 위로).
   * 상품마다 페이지가 따로인 이 메뉴에서는 기본값이 문제가 된다 — 목록에서
   * 다른 상품을 고를 때마다 화면이 페이지 맨 위(상단 배너)로 튀어 올라,
   * 방금 보던 자리로 매번 다시 내려와야 한다.
   */
  scroll?: boolean;
}

const MotionLink = motion.create(Link);

export const MenuVertical = ({
  menuItems = [],
  color = "#ff6900",
  skew = 0,
  activeHref,
  scroll,
}: MenuVerticalProps) => {
  return (
    <>
      {/* 좁은 화면 — 가로 한 줄.
          세로 목록은 4xl 글자 다섯 줄이라 화면 절반을 먹고, 본문이 시작하기
          전에 스크롤을 한참 해야 한다. 가로로 눕히고 글자를 줄인다.

          모션 변형(화살표 슬라이드 + 글자 밀림)은 가져오지 않는다. 그 동작은
          "왼쪽에서 화살표가 들어오고 글자가 밀려난다"는 세로 목록 전제로
          짜여 있어서, 가로로 늘어놓으면 항목끼리 겹친다. 여기서는 색과
          밑줄로만 지금 자리를 표시한다.

          -mx-6 px-6 — 컨테이너 좌우 여백(모바일 24px)만큼 밖으로 물려서,
          잘린 항목이 화면 끝에 걸쳐 보이게 한다. 더 있다는 신호다. */}
      <div className="-mx-6 flex w-[calc(100%+3rem)] gap-6 overflow-x-auto px-6 pb-1 [scrollbar-width:none] xl:hidden [&::-webkit-scrollbar]:hidden">
        {menuItems.map((item) => {
          const active = item.href === activeHref;
          return (
            <Link
              key={item.href}
              href={item.href}
              scroll={scroll}
              aria-current={active ? "page" : undefined}
              className="shrink-0 border-b-2 pb-1.5 text-base font-bold whitespace-nowrap transition-colors"
              style={{
                color: active ? color : undefined,
                borderColor: active ? color : "transparent",
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* 넓은 화면 — 원래의 세로 목록.

          갈리는 지점은 xl(1280px)이다. 페이지 쪽에서 메뉴가 왼쪽 세로 칸으로
          서는 지점과 같아야 한다(app/service/[slug]/page.tsx) — 어긋나면
          세로 목록이 본문 위에 한 줄로 통째로 얹혀 오른쪽이 비고 본문이
          그만큼 밀려 내려간다. */}
      <div className="hidden w-fit flex-col gap-4 px-10 xl:flex">
        {menuItems.map((item, index) => (
          <motion.div
            key={`${item.href}-${index}`}
            className="group/nav flex items-center gap-2 cursor-pointer text-zinc-900 dark:text-zinc-50"
            initial="initial"
            animate={item.href === activeHref ? "hover" : "initial"}
            whileHover="hover"
          >
            <motion.div
              variants={{
                initial: { x: "-100%", color: "inherit", opacity: 0 },
                hover: { x: 0, color, opacity: 1 },
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="z-0"
            >
              <ArrowRight strokeWidth={3} className="size-10" />
            </motion.div>

            <MotionLink
              href={item.href}
              scroll={scroll}
              variants={{
                initial: { x: -40, color: "inherit" },
                hover: { x: 0, color, skewX: skew },
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="font-semibold text-4xl no-underline"
            >
              {item.label}
            </MotionLink>
          </motion.div>
        ))}
      </div>
    </>
  );
};
