"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import type { NavItem } from "@/lib/site";

/**
 * 상단 바 + 왼쪽에서 밀려 들어오는 전체화면 메뉴.
 *
 * 바는 MENU(좌) / 로고(중앙) / CONTACT(우) 3분할이고, MENU를 누르면
 * 물 층 세 장이 시차를 두고 왼쪽에서 들어온 뒤 메뉴가 드러난다.
 * 항목에 호버하면 그 항목에 배정된 배경 도형이 떠오른다.
 *
 * 원본은 GSAP 데모(우측 슬라이드 + 인디고/퍼플 도형)였고, 여기에 맞춰
 *  - 방향을 좌측으로 뒤집고(xPercent 부호),
 *  - 색을 심해 팔레트로 갈고,
 *  - 실제 nav 데이터(하위 메뉴 포함)를 받도록 바꾸고,
 *  - 라우트 이동·ESC·스크롤 잠금·모션 최소화 대응을 더했다.
 *
 * GSAP은 클래스 이름으로 요소를 찾는다. 아래 클래스명을 바꿀 때는
 * globals.css의 키네틱 메뉴 블록도 같이 봐야 한다.
 */

const EASE = "diverz-main";

if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase);
  // 같은 이름으로 두 번 만들면 덮어쓰기라 문제는 없지만, 굳이 다시 만들지 않는다.
  if (!gsap.parseEase(EASE)) {
    CustomEase.create(EASE, "0.65, 0.01, 0.05, 0.99");
  }
}

type Props = {
  items: readonly NavItem[];
  /** 바 가운데 로고 텍스트. */
  logo: string;
  /** 바 오른쪽 링크. */
  contact: { href: string; label: string };
  /** 메뉴 하단의 주 전환 버튼. */
  cta: { href: string; label: string };
  /** 메뉴 하단에 작게 붙는 회사 정보. */
  meta?: readonly string[];
};

/** 현재 경로가 이 메뉴(또는 하위 메뉴)에 속하는지. */
function isActive(pathname: string, item: NavItem): boolean {
  const base = item.href.split("#")[0];
  if (pathname === base) return true;
  if (base !== "/" && pathname.startsWith(`${base}/`)) return true;
  return (item.children ?? []).some((child) => isActive(pathname, child));
}

export default function KineticNav({ items, logo, contact, cta, meta }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  /**
   * 래퍼를 DOM에 띄워둘지. `open`과 따로 두는 이유:
   *  - 닫을 때는 애니메이션이 끝난 뒤에 감춰야 한다(그래서 바로 false가 아니다).
   *  - display를 GSAP에 맡기면 리렌더가 style prop을 다시 찍어 열린 메뉴가
   *    사라진다. 또 탭이 백그라운드면 rAF가 안 돌아 timeline이 tick하지 않아
   *    아예 안 열린다. 그래서 display는 React가 쥐고, GSAP은 모션만 맡는다.
   */
  const [visible, setVisible] = useState(false);
  // 렌더 중 조정 — 여는 순간 같은 렌더에서 display:block이 되도록.
  if (open && !visible) setVisible(true);

  /* 항목 호버 → 배경 도형 등장.
     열림/닫힘과 수명이 다르므로(마운트 내내 유지) 별도 effect로 둔다. */
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const shapesBox = root.querySelector(".ambient-background-shapes");
      if (!shapesBox) return;

      const cleanups: Array<() => void> = [];

      root.querySelectorAll(".menu-list-item[data-shape]").forEach((item) => {
        const shape = shapesBox.querySelector(
          `.bg-shape-${item.getAttribute("data-shape")}`
        );
        if (!shape) return;
        const els = shape.querySelectorAll(".shape-element");

        const onEnter = () => {
          // 한 번에 한 도형만 보이게 나머지를 먼저 끈다.
          shapesBox
            .querySelectorAll(".bg-shape")
            .forEach((s) => s.classList.remove("active"));
          shape.classList.add("active");
          gsap.fromTo(
            els,
            { scale: 0.5, opacity: 0, rotation: -10 },
            {
              scale: 1,
              opacity: 1,
              rotation: 0,
              duration: 0.6,
              stagger: 0.08,
              ease: "back.out(1.7)",
              overwrite: "auto",
            }
          );
        };

        const onLeave = () => {
          gsap.to(els, {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            overwrite: "auto",
            onComplete: () => shape.classList.remove("active"),
          });
        };

        item.addEventListener("mouseenter", onEnter);
        item.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          item.removeEventListener("mouseenter", onEnter);
          item.removeEventListener("mouseleave", onLeave);
        });
      });

      return () => cleanups.forEach((fn) => fn());
    }, containerRef);

    return () => ctx.revert();
  }, []);

  /* 열림/닫힘 시퀀스. */
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    // 마운트 직후(한 번도 연 적 없음)에는 닫기 시퀀스를 돌릴 이유가 없다.
    if (!open && !visible) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const menu = root.querySelector(".menu-content");
      const overlay = root.querySelector(".overlay");
      const panels = root.querySelectorAll(".backdrop-layer");
      const links = root.querySelectorAll(".nav-link");
      const fades = root.querySelectorAll("[data-menu-fade]");
      const btnTexts = root.querySelectorAll(".menu-button-text > span");
      const btnIcon = root.querySelector(".menu-button-icon");

      // 모션 최소화: 시퀀스 없이 최종 상태로만 전환한다.
      if (reduce) {
        gsap.set([overlay, ...links, ...fades], {
          autoAlpha: open ? 1 : 0,
          yPercent: 0,
          rotate: 0,
        });
        gsap.set(panels, { xPercent: 0 });
        gsap.set(menu, { xPercent: 0 });
        if (!open) setVisible(false);
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: EASE, duration: 0.7 } });

      if (open) {
        tl.set(menu, { xPercent: 0 })
          // MENU ↔ CLOSE 글자 교체 + 아이콘 회전
          .fromTo(btnTexts, { yPercent: 0 }, { yPercent: -100, stagger: 0.2 })
          .fromTo(btnIcon, { rotate: 0 }, { rotate: 315 }, "<")
          .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1 }, "<")
          // 물 층 3장이 왼쪽(-101%)에서 시차를 두고 들어온다.
          .fromTo(
            panels,
            { xPercent: -101 },
            { xPercent: 0, stagger: 0.12, duration: 0.575 },
            "<"
          )
          .fromTo(
            links,
            { yPercent: 140, rotate: 10 },
            { yPercent: 0, rotate: 0, stagger: 0.05 },
            "<+=0.35"
          );

        if (fades.length) {
          // clearProps: 하위 링크가 다음 열기에서 인라인 스타일에 갇히지 않게 한다.
          tl.fromTo(
            fades,
            { autoAlpha: 0, yPercent: 50 },
            { autoAlpha: 1, yPercent: 0, stagger: 0.04, clearProps: "all" },
            "<+=0.2"
          );
        }
      } else {
        tl.to(overlay, { autoAlpha: 0 })
          // 닫힐 때도 왼쪽으로 빠진다.
          .to(menu, { xPercent: -120 }, "<")
          .to(btnTexts, { yPercent: 0 }, "<")
          .to(btnIcon, { rotate: 0 }, "<")
          // 다 빠져나간 뒤에 DOM에서 감춘다(display는 React가 쥐고 있다).
          .call(() => setVisible(false));
      }
    }, containerRef);

    return () => ctx.revert();
    // visible은 "닫기 시퀀스를 돌릴지" 판단에만 쓰고, 값이 바뀌었다고
    // 시퀀스를 다시 돌리면 안 된다(닫기 완료 → visible=false → 재실행).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /* ESC로 닫기. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  /* 열려 있는 동안 뒤 페이지 스크롤을 막는다.
     스크롤바가 사라지며 생기는 가로 밀림은 padding으로 상쇄한다. */
  useEffect(() => {
    if (!open) return;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
    };
  }, [open]);

  /* 라우트가 바뀌면 닫는다 — 링크 onClick이 못 잡는 뒤로/앞으로 가기용.
     effect가 아니라 렌더 중 조정이다(Typewriter와 같은 패턴). effect에서
     동기로 setState를 부르면 렌더가 연쇄되고 이 프로젝트 eslint가 막는다. */
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

  return (
    <div ref={containerRef}>
      {/* 바는 오버레이보다 위에 둬야 열린 상태에서도 CLOSE를 누를 수 있다. */}
      <header className="fixed inset-x-0 top-0 z-60 px-3 py-3 sm:px-5">
        {/* 모서리는 직각. (예전에는 rounded-full 알약 형태였다) */}
        <div className="mx-auto grid h-14 max-w-[1800px] grid-cols-[1fr_auto_1fr] items-center border border-line bg-abyss/80 px-5 backdrop-blur-xl sm:px-7">
          {/* 좌: MENU 토글 */}
          <div className="justify-self-start">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="kinetic-menu"
              className="group flex items-center gap-2.5"
            >
              {/* 글자 두 줄을 위아래로 쌓고 위로 밀어 MENU ↔ CLOSE 를 바꾼다. */}
              <span className="menu-button-text relative block h-4 overflow-hidden text-left">
                <span className="block font-sans text-[0.68rem] leading-4 font-bold tracking-[0.22em] text-white/80 transition-colors group-hover:text-white">
                  MENU
                </span>
                <span className="block font-sans text-[0.68rem] leading-4 font-bold tracking-[0.22em] text-accent">
                  CLOSE
                </span>
              </span>
              <svg
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden
                className="menu-button-icon h-3 w-3 text-accent"
              >
                <path
                  d="M7.33333 16L7.33333 0L8.66667 0L8.66667 16L7.33333 16Z"
                  fill="currentColor"
                />
                <path
                  d="M16 8.66667L0 8.66667L0 7.33333L16 7.33333L16 8.66667Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>

          {/* 중앙: 로고. 서체는 사이트 전체와 같은 Pretendard로 통일했다.
              (예전에는 여기만 Montserrat 워드마크였다) */}
          <Link
            href="/"
            onClick={close}
            className="justify-self-center font-display text-lg font-black tracking-tight text-white italic sm:text-xl"
          >
            {logo}
          </Link>

          {/* 우: CONTACT */}
          <Link
            href={contact.href}
            onClick={close}
            className="group flex items-center gap-2 justify-self-end font-sans text-[0.68rem] font-bold tracking-[0.22em] text-white/80 transition-colors hover:text-white"
          >
            {contact.label}
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-accent transition-transform group-hover:scale-150"
            />
          </Link>
        </div>
      </header>

      {/* 전체화면 메뉴 */}
      <div
        id="kinetic-menu"
        data-nav={open ? "open" : "closed"}
        style={{ display: visible ? "block" : "none" }}
        /* 닫히는 중에는 클릭을 통과시킨다. 닫기 시퀀스가 도중에 멈춰도
           (탭 전환 등으로 rAF가 멈추면 그럴 수 있다) 화면이 먹통이 되지 않는다. */
        className={`nav-overlay-wrapper fixed inset-0 z-50 ${
          open ? "" : "pointer-events-none"
        }`}
      >
        <button
          type="button"
          aria-label="메뉴 닫기"
          onClick={close}
          className="overlay absolute inset-0 h-full w-full cursor-default bg-abyss/60 backdrop-blur-sm"
        />

        <nav
          aria-label="전체 메뉴"
          className="menu-content absolute inset-y-0 left-0 w-full sm:w-[min(94vw,46rem)]"
        >
          {/* 배경: 물 층 3장 + 호버 도형 */}
          <div aria-hidden className="menu-bg absolute inset-0 overflow-hidden">
            <div className="backdrop-layer first" />
            <div className="backdrop-layer second" />
            <div className="backdrop-layer" />
            <div className="ambient-background-shapes absolute inset-0">
              <ShapeBubbles />
              <ShapeCurrent />
              <ShapeDepthGrid />
              <ShapeBlobs />
              <ShapeRays />
            </div>
          </div>

          {/* 내용 */}
          <div className="menu-content-wrapper relative flex h-full flex-col justify-between gap-10 overflow-y-auto px-7 pt-28 pb-10 sm:px-14 sm:pt-32 sm:pb-14">
            <ul className="menu-list">
              {items.map((item, i) => {
                const active = isActive(pathname, item);
                return (
                  <li
                    key={item.href}
                    className="menu-list-item border-b border-white/10 last:border-b-0"
                    data-shape={(i % 5) + 1}
                  >
                    {/* 링크가 아래에서 솟아오르므로 넘치는 부분을 자른다. */}
                    <div className="overflow-hidden">
                      <Link
                        href={item.href}
                        onClick={close}
                        className="nav-link group relative flex items-baseline gap-4 py-4 sm:gap-6 sm:py-5"
                      >
                        <span className="font-sans text-[0.6rem] font-bold tracking-[0.2em] text-accent/60">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`nav-link-text font-sans text-[clamp(1.35rem,4vw,2.4rem)] leading-none font-bold tracking-tight transition-colors ${
                            active
                              ? "text-accent"
                              : "text-white group-hover:text-accent-soft"
                          }`}
                        >
                          {item.label}
                        </span>
                        {/* 호버 시 왼쪽에서 차오르는 밑선 */}
                        <span
                          aria-hidden
                          className="nav-link-hover-bg absolute bottom-3 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100"
                        />
                      </Link>
                    </div>

                    {item.children && (
                      <div
                        data-menu-fade
                        className="flex flex-wrap gap-x-5 gap-y-1.5 pb-5 pl-8 sm:pl-12"
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={close}
                            className="text-sm text-white/50 transition-colors hover:text-accent"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

            <div data-menu-fade className="flex flex-col gap-6">
              <Link
                href={cta.href}
                onClick={close}
                className="inline-flex w-fit items-center gap-3 rounded-full bg-accent px-7 py-3.5 font-sans text-xs font-bold tracking-[0.14em] text-abyss transition hover:bg-accent-soft"
              >
                {cta.label}
                <span aria-hidden>→</span>
              </Link>
              {meta && meta.length > 0 && (
                <address className="flex flex-col gap-1 text-xs leading-relaxed text-white/40 not-italic">
                  {meta.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </address>
              )}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

/* ── 호버 배경 도형 ────────────────────────────────────────────
   전부 심해 팔레트(accent #38bdf8 / soft #7dd3fc / mid #2b7fc4)로 맞췄다.
   원본의 인디고·퍼플·핑크는 이 사이트에서 남의 색이라 전부 갈아치웠다.
   ──────────────────────────────────────────────────────────── */

/** 01 — 떠오르는 기포 */
function ShapeBubbles() {
  return (
    <svg className="bg-shape bg-shape-1" viewBox="0 0 400 400" fill="none">
      <circle className="shape-element" cx="80" cy="120" r="40" fill="rgb(56 189 248 / 0.16)" />
      <circle className="shape-element" cx="300" cy="80" r="60" fill="rgb(125 211 252 / 0.12)" />
      <circle className="shape-element" cx="200" cy="300" r="80" fill="rgb(43 127 196 / 0.14)" />
      <circle className="shape-element" cx="350" cy="280" r="30" fill="rgb(56 189 248 / 0.18)" />
    </svg>
  );
}

/** 02 — 해류 */
function ShapeCurrent() {
  return (
    <svg className="bg-shape bg-shape-2" viewBox="0 0 400 400" fill="none">
      <path
        className="shape-element"
        d="M0 200 Q100 100, 200 200 T 400 200"
        stroke="rgb(56 189 248 / 0.18)"
        strokeWidth="60"
        fill="none"
      />
      <path
        className="shape-element"
        d="M0 280 Q100 180, 200 280 T 400 280"
        stroke="rgb(125 211 252 / 0.13)"
        strokeWidth="40"
        fill="none"
      />
    </svg>
  );
}

/** 03 — 수심 격자 */
function ShapeDepthGrid() {
  // 아래로 갈수록 점이 커진다 — 내려갈수록 압력이 커지는 느낌.
  const rows = [
    { y: 50, r: 6, o: 0.3 },
    { y: 150, r: 9, o: 0.26 },
    { y: 250, r: 12, o: 0.22 },
    { y: 350, r: 15, o: 0.16 },
  ];
  const tints = ["56 189 248", "125 211 252", "43 127 196"];
  return (
    <svg className="bg-shape bg-shape-3" viewBox="0 0 400 400" fill="none">
      {rows.flatMap((row, ri) =>
        [50, 150, 250, 350].map((x, ci) => (
          <circle
            key={`${ri}-${ci}`}
            className="shape-element"
            cx={x}
            cy={row.y}
            r={row.r}
            fill={`rgb(${tints[(ri + ci) % tints.length]} / ${row.o})`}
          />
        ))
      )}
    </svg>
  );
}

/** 04 — 유기적 형태 */
function ShapeBlobs() {
  return (
    <svg className="bg-shape bg-shape-4" viewBox="0 0 400 400" fill="none">
      <path
        className="shape-element"
        d="M100 100 Q150 50, 200 100 Q250 150, 200 200 Q150 250, 100 200 Q50 150, 100 100"
        fill="rgb(56 189 248 / 0.14)"
      />
      <path
        className="shape-element"
        d="M250 200 Q300 150, 350 200 Q400 250, 350 300 Q300 350, 250 300 Q200 250, 250 200"
        fill="rgb(43 127 196 / 0.16)"
      />
    </svg>
  );
}

/** 05 — 수면에서 내려오는 광선 */
function ShapeRays() {
  return (
    <svg className="bg-shape bg-shape-5" viewBox="0 0 400 400" fill="none">
      <line
        className="shape-element"
        x1="0"
        y1="100"
        x2="300"
        y2="400"
        stroke="rgb(56 189 248 / 0.16)"
        strokeWidth="30"
      />
      <line
        className="shape-element"
        x1="100"
        y1="0"
        x2="400"
        y2="300"
        stroke="rgb(125 211 252 / 0.12)"
        strokeWidth="25"
      />
      <line
        className="shape-element"
        x1="200"
        y1="0"
        x2="400"
        y2="200"
        stroke="rgb(43 127 196 / 0.14)"
        strokeWidth="20"
      />
    </svg>
  );
}
