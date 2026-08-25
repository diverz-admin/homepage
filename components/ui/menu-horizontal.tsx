"use client";

import { motion } from "motion/react";

import Link from "next/link";

type MenuItem = {
  label: string;
  href: string;
};

interface MenuHorizontalProps {
  menuItems: MenuItem[];
  color?: string;
  /**
   * 고르지 않은 항목의 글자색.
   *
   * 클래스가 아니라 값으로 받는다 — motion 이 이 색에서 color 로 보간하는데,
   * 원본처럼 variants 에 "inherit" 을 적으면 "inherit 은 보간할 수 없다"고
   * 경고하며 색이 툭 끊긴다(들어올 때만 부드럽고 빠질 때는 계단).
   *
   * 같은 값을 style 로도 한 번 더 얹는다. motion 은 애니메이션을 시작할 때
   * 인라인 style 에서 현재 값을 읽는데, 색을 클래스로만 주면 거기서 읽히는
   * 값이 "inherit" 이라 같은 경고가 뜬다.
   */
  baseColor?: string;
  skew?: number;
  /**
   * 현재 보고 있는 항목의 href. 그 항목은 호버하지 않아도 hover 상태로
   * 고정된다(화살표가 나와 있고 색이 켜진 상태).
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

/**
 * 상품 5종을 가로 한 줄로 눕히는 메뉴. 본문 위에 얹는다.
 *
 * 예전에는 넓은 화면에서 왼쪽 세로 칸으로 섰다(이름도 MenuVertical이었다).
 * 그 배치는 메뉴 폭(≈353px)을 본문에서 통째로 빼앗아, 1280px 근처에서
 * 본문이 340px까지 눌리고 오른쪽 개념도가 설 자리를 잃었다. 지금은 어느
 * 폭에서든 가로 한 줄이고, 본문은 지면 전체를 쓴다.
 */
export const MenuHorizontal = ({
  menuItems = [],
  color = "#ff6900",
  baseColor = "#18181b",
  skew = 0,
  activeHref,
  scroll,
}: MenuHorizontalProps) => {
  return (
    <>
      {/* 좁은 화면 — 넘치면 옆으로 미는 줄.

          모션 변형(화살표 슬라이드)은 가져오지 않는다. 항목이 다섯이라
          좁은 화면에서는 어차피 한 화면에 다 안 들어오고, 화살표까지 넣으면
          한 항목이 더 밀려 나간다. 여기서는 색과 밑줄로만 지금 자리를 표시한다.

          -mx-6 px-6 — 컨테이너 좌우 여백(모바일 24px)만큼 밖으로 물려서,
          잘린 항목이 화면 끝에 걸쳐 보이게 한다. 더 있다는 신호다.

          justify-center-safe — 다 들어가면 가운데로 모으고, 넘치면 왼쪽부터
          붙인다. 그냥 justify-center 로 두면 넘친 만큼이 스크롤 컨테이너의
          왼쪽 밖으로 잘려 나가 첫 항목에 영영 닿을 수 없다. */}
      <div className="-mx-6 flex w-[calc(100%+3rem)] justify-center-safe gap-6 overflow-x-auto px-6 pb-1 [scrollbar-width:none] xl:hidden [&::-webkit-scrollbar]:hidden">
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
                color: active ? color : baseColor,
                borderColor: active ? color : "transparent",
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* 넓은 화면 — 같은 한 줄, 글자색만 hover/active로 바뀐다.
          예전에는 라벨 왼쪽에 화살표가 미끄러져 들어왔는데(absolute +
          gap 40px로 자리를 비워 뒀다), 화살표를 빼면서 그 여백도 걷었다.

          flex-wrap — 1280px에서 다섯 항목이 여유 있게 들어가지만,
          라벨이 길어지는 날을 대비해 넘치면 잘리지 말고 접히게 둔다. */}
      <div className="hidden flex-wrap items-center justify-center gap-x-8 gap-y-3 xl:flex 2xl:gap-x-10">
        {menuItems.map((item, index) => {
          const active = item.href === activeHref;
          return (
            <motion.div
              key={`${item.href}-${index}`}
              className="group/nav flex items-center cursor-pointer"
              /* 지금 보고 있는 항목은 처음부터 켜진 모습으로 그린다
                 (initial={false} = 마운트 애니메이션 없이 animate 값에서 시작).
                 페이드로 들어오게 두면, 배경 탭에서 열린 경우 브라우저가
                 rAF 를 멈춰 애니메이션이 중간에 얼어붙은 채로 남는다. */
              initial={active ? false : "initial"}
              animate={active ? "hover" : "initial"}
              whileHover="hover"
            >
              <MotionLink
                href={item.href}
                scroll={scroll}
                aria-current={active ? "page" : undefined}
                style={{ color: baseColor }}
                variants={{
                  initial: { color: baseColor, skewX: 0 },
                  hover: { color, skewX: skew },
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="text-base font-semibold whitespace-nowrap no-underline 2xl:text-lg"
              >
                {item.label}
              </MotionLink>
            </motion.div>
          );
        })}
      </div>
    </>
  );
};
