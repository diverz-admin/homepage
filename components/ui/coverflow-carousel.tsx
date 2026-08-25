"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export interface CoverflowSlide {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  meta?: { label: string; value: string }[];
  /**
   * 넘기면 카드 전체가 링크가 된다. 정면 카드는 눌렀을 때 이동하고,
   * 옆 카드는 먼저 가운데로 돌려세운다 — 뒤로 젖혀져 반쯤 가려진 카드를
   * 누른 것을 "그 페이지로 가겠다"는 뜻으로 읽으면 오작동에 가깝다.
   */
  href?: string;
}

export interface CoverflowCarouselProps {
  slides: CoverflowSlide[];
  /** Degrees the first neighbour tilts. */
  rotate?: number;
  /** How far the first neighbour recedes, as a fraction of card width. */
  depth?: number;
  /** Viewer distance as a multiple of card width — smaller is a wider lens. */
  perspective?: number;
  /** Exponent on distance. Below 1 the rake eases off as cards travel out. */
  falloff?: number;
  /** Opacity lost per step from the centre. */
  fade?: number;
  /** Any CSS length. Everything else is derived from it, so the rake scales. */
  cardWidth?: string;
  /** Space between cards, as a fraction of card width. */
  gap?: number;
  loop?: boolean;
  showCaption?: boolean;
  showPagination?: boolean;
  showNavigation?: boolean;
  /** Names the carousel for assistive tech. */
  label?: string;
  className?: string;
  cardClassName?: string;
}

export function CoverflowCarousel({
  slides,
  rotate = 44,
  depth = 0.6,
  perspective = 3,
  falloff = 0.56,
  fade = 0.1,
  cardWidth = "clamp(148px, 22vw, 260px)",
  gap = 0.05,
  loop = true,
  showCaption = false,
  showPagination = false,
  showNavigation = false,
  label = "Cover carousel",
  className,
  cardClassName,
}: CoverflowCarouselProps) {
  const count = slides.length;

  const frameRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  /** 카드 위에 얹는 어둡게-깔기 레이어 + 이름표. 가운데(정면)로 올수록 짙어진다. */
  const scrimRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  /** Fractional card index at the centre. The single source of truth. */
  const posRef = React.useRef(0);
  /** Where the current settle is headed. Stepping off `pos` instead would
      swallow a keypress that lands mid-flight, before the round-off moves. */
  const targetRef = React.useRef(0);
  const widthRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  const dragRef = React.useRef<{
    id: number;
    x: number;
    pos: number;
    v: number;
    t: number;
  } | null>(null);
  /**
   * 마지막으로 누른 자리. 카드 링크를 누른 채 링을 돌리고 손을 떼면 click 이
   * 그대로 따라오는데, 그때 페이지가 넘어가면 안 된다 — 눌린 자리와 클릭이
   * 난 자리를 견줘 "끌기였는지"를 그 자리에서 판단한다.
   *
   * "끌었다" 플래그를 세워 두는 대신 좌표를 남기는 건, 플래그는 다음 누름
   * 전까지 참인 채로 남아 있어서 — 키보드 Enter 처럼 누름 없이 오는 클릭까지
   * 같이 막아 버리기 때문이다.
   */
  const pressRef = React.useRef<{ x: number; y: number } | null>(null);

  const [selected, setSelected] = React.useState(0);
  const router = useRouter();

  /** Nearest whole card, folded back into 0..count-1. */
  const indexAt = React.useCallback(
    (pos: number) => ((Math.round(pos) % count) + count) % count,
    [count],
  );

  // Paint straight to the DOM. Sixty state updates a second would re-render
  // every card for numbers React never needs to see.
  const paint = React.useCallback(() => {
    const width = widthRef.current;
    if (!width) return;
    const pitch = width * (1 + gap);
    const pos = posRef.current;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      // Fold the distance into the shorter way round the ring. This is the
      // whole looping mechanism — no cloned nodes, no shuffling the DOM.
      let offset = index - pos;
      if (loop) {
        offset = ((offset % count) + count) % count;
        if (offset > count / 2) offset -= count;
      }

      const distance = Math.abs(offset);
      // Both the tilt and the recession ease off as cards travel out —
      // doubling the distance adds only about half again as much of each.
      // A linear ramp folds the second card shut; this keeps it readable.
      const ramp = Math.pow(distance, falloff);
      // Capped short of edge-on so a far card never turns its back.
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);

      card.style.transform =
        `translateX(calc(-50% + ${offset * pitch}px)) ` +
        `translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;

      // A card is teleported across the ring at exactly half a turn out, so it
      // has to be gone by then or the jump is visible.
      const edge = loop ? Math.min(1, Math.max(0, count / 2 - distance)) : 1;
      card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge);
      card.style.zIndex = String(100 - Math.round(distance));
      // 반대편으로 넘어가는 중이라 안 보이는 카드는 클릭도 받지 않는다 —
      // 투명해도 링크는 살아 있어서, 안 보이는 카드가 클릭을 가로챈다.
      card.style.pointerEvents = edge > 0 ? "auto" : "none";

      // 정면(거리 0)에 가까울수록 어둡게 깔고 이름표를 띄운다 — 옆 카드로
      // 넘어가면 매끄럽게 사라지도록 거리에 비례해 페이드한다.
      const focus = Math.max(0, 1 - distance * 1.4) * edge;
      const scrim = scrimRefs.current[index];
      if (scrim) scrim.style.opacity = String(focus);
      const labelEl = labelRefs.current[index];
      if (labelEl) labelEl.style.opacity = String(focus);
    });
  }, [count, depth, fade, falloff, gap, loop, rotate]);

  const settle = React.useCallback(
    (target: number) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      targetRef.current = target;
      setSelected(indexAt(target));

      const step = () => {
        const remaining = target - posRef.current;
        if (Math.abs(remaining) < 0.0004) {
          posRef.current = target;
          paint();
          rafRef.current = null;
          return;
        }
        // ponytail: exponential ease-out, not a spring. Swap in a spring only
        // if the settle needs overshoot.
        posRef.current += remaining * 0.16;
        paint();
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [indexAt, paint],
  );

  const clamp = React.useCallback(
    (pos: number) => (loop ? pos : Math.max(0, Math.min(count - 1, pos))),
    [count, loop],
  );

  const goTo = React.useCallback(
    (index: number) => {
      // Take the shorter way round rather than unwinding the whole ring.
      const target = loop
        ? index + Math.round((targetRef.current - index) / count) * count
        : index;
      settle(clamp(target));
    },
    [clamp, count, loop, settle],
  );

  const nudge = React.useCallback(
    (by: number) => settle(clamp(Math.round(targetRef.current) + by)),
    [clamp, settle],
  );

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    targetRef.current = posRef.current;
    pressRef.current = { x: event.clientX, y: event.clientY };
    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      pos: posRef.current,
      v: 0,
      t: performance.now(),
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;

    const pitch = widthRef.current * (1 + gap);
    if (!pitch) return;

    const now = performance.now();
    const previous = posRef.current;
    posRef.current = clamp(drag.pos - (event.clientX - drag.x) / pitch);
    // Cards per second, for the throw.
    drag.v = ((posRef.current - previous) / Math.max(now - drag.t, 1)) * 1000;
    drag.t = now;

    const index = indexAt(posRef.current);
    if (index !== selected) setSelected(index);
    paint();
  };

  /**
   * 이 클릭이 끌기 끝에 따라온 것인지.
   *
   * 손가락도 마우스도 누르는 사이 몇 px 은 흔들린다 — 그 정도는 클릭에 딸린
   * 노이즈로 보고, 그 위로 넘어간 것만 끌기로 친다. 누른 기록이 없으면
   * (키보드 Enter 등) 끌기가 아니다.
   */
  const cameFromDrag = (event: { clientX: number; clientY: number }) => {
    const press = pressRef.current;
    if (!press) return false;
    return Math.hypot(event.clientX - press.x, event.clientY - press.y) > 10;
  };

  /**
   * 옆 카드를 눌렀을 때도 그 카드의 페이지로 보낸다.
   *
   * 카드에 걸린 링크가 아니라 무대에서 받는다 — 옆 카드는 rotateY 로 젖혀져
   * 있어서 크롬이 그 안을 히트 테스트하지 않는다(클릭이 카드가 아니라 뒤의
   * 무대로 떨어져, 링크가 아예 눌리지 않는다). 정면 카드만 제 링크가 클릭을
   * 받으므로, 여기서는 눌린 좌표가 어느 카드의 화면상 자리에 들어가는지로
   * 되짚어 같은 곳으로 보낸다.
   *
   * 한때는 옆 카드를 "가운데로 돌려세우기"로 뒀는데, 다섯 장 중 넉 장이
   * 눌러도 페이지로 가지 않는 셈이라 "클릭이 안 먹는다"로 읽혔다.
   */
  const onFrameClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // 정면 카드는 제 링크가 이미 처리했다. 끌기 뒤에 따라오는 클릭도 뺀다.
    if (cameFromDrag(event)) return;
    if ((event.target as HTMLElement).closest("a")) return;

    let nearest = -1;
    let best = Infinity;
    cardRefs.current.forEach((card, index) => {
      if (!card || card.style.pointerEvents === "none") return;
      const rect = card.getBoundingClientRect();
      if (event.clientY < rect.top || event.clientY > rect.bottom) return;
      if (event.clientX < rect.left || event.clientX > rect.right) return;
      // 겹치는 구간이 생기면 중심이 가까운 쪽을 고른다.
      const distance = Math.abs(event.clientX - (rect.left + rect.right) / 2);
      if (distance < best) {
        best = distance;
        nearest = index;
      }
    });
    if (nearest === -1) return;

    const href = slides[nearest].href;
    if (href) router.push(href);
    else if (nearest !== indexAt(posRef.current)) goTo(nearest);
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;
    // Let a flick carry, but never more than two cards.
    const carried = Math.max(-2, Math.min(2, drag.v * 0.18));
    settle(clamp(Math.round(posRef.current + carried)));
  };

  // Card width drives pitch, depth and perspective, so it is the only thing
  // worth measuring — and only when the box actually changes.
  useIsoLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const measure = () => {
      const card = cardRefs.current[0];
      if (!card) return;
      widthRef.current = card.offsetWidth;
      paint();
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [paint]);

  React.useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const active = slides[selected];

  return (
    <div
      className={cn("w-full", className)}
      style={{ ["--cf-card" as string]: cardWidth }}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className="relative">
        <div
          ref={frameRef}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClick={onFrameClick}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              nudge(-1);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              nudge(1);
            }
          }}
          // Vertical padding keeps the drop shadows clear of the overflow clip.
          className="cursor-grab overflow-hidden py-10 outline-none ring-ring focus-visible:ring-2 active:cursor-grabbing"
          style={{
            perspective: `calc(var(--cf-card) * ${perspective})`,
            // Horizontal drag is ours; the page keeps vertical scrolling.
            touchAction: "pan-y",
          }}
        >
          <div
            className="relative select-none"
            style={{
              height: "var(--cf-card)",
              transformStyle: "preserve-3d",
            }}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${count}`}
                className={cn(
                  "absolute left-1/2 top-0 aspect-square overflow-hidden bg-muted shadow-xl will-change-transform",
                  cardClassName,
                )}
                style={{ width: "var(--cf-card)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.src}
                  alt={slide.alt}
                  draggable={false}
                  className="h-full w-full select-none object-cover"
                />

                {/* 정면에 가까울수록 카드 전체가 고르게 어두워지는 스크림 —
                    가운데 놓일 글자가 어디서나 잘 읽히도록 그라디언트가
                    아니라 판판한 검정을 쓴다. paint()가 거리에 따라
                    opacity를 직접 갱신한다(초기값 0). */}
                <div
                  ref={(node) => {
                    scrimRefs.current[index] = node;
                  }}
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-black/70 opacity-0"
                />

                {(slide.title || slide.subtitle) && (
                  <div
                    ref={(node) => {
                      labelRefs.current[index] = node;
                    }}
                    className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-5 text-center text-white opacity-0"
                  >
                    {slide.subtitle && (
                      <p className="text-xs font-semibold tracking-widest uppercase opacity-80">
                        {slide.subtitle}
                      </p>
                    )}
                    {slide.title && (
                      <p className="mt-1 text-lg font-bold">{slide.title}</p>
                    )}
                  </div>
                )}

                {/* 카드를 통째로 덮는 링크. 진짜 <a> 라서 크롤러도 읽고,
                    새 탭으로 열기·상태 표시줄 미리보기가 그대로 동작한다.

                    draggable={false} 가 없으면 앵커의 기본 드래그(링크
                    끌어다 놓기)가 포인터를 가로채 링이 안 돈다.
                    탭 순서에는 정면 카드만 넣는다 — 나머지는 화면에서
                    젖혀져 있어 초점이 가도 어디에 있는지 보이지 않는다. */}
                {slide.href && (
                  <Link
                    href={slide.href}
                    draggable={false}
                    tabIndex={index === selected ? 0 : -1}
                    aria-hidden={index !== selected}
                    onClick={(event) => {
                      // 끌기 끝에 따라온 클릭이면 이동하지 않는다.
                      if (cameFromDrag(event)) event.preventDefault();
                    }}
                    className="absolute inset-0 cursor-pointer outline-none ring-inset ring-white focus-visible:ring-2"
                  >
                    <span className="sr-only">{slide.title ?? slide.alt}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {showNavigation && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => nudge(-1)}
              className="absolute left-4 top-1/2 sm:left-8 z-[200] -translate-y-1/2 rounded-full bg-background/70 p-2 text-foreground backdrop-blur transition hover:bg-background"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => nudge(1)}
              className="absolute right-4 top-1/2 sm:right-8 z-[200] -translate-y-1/2 rounded-full bg-background/70 p-2 text-foreground backdrop-blur transition hover:bg-background"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>

      {showCaption && active?.title && (
        <div
          key={selected}
          className="mt-2 flex flex-col items-center px-6 duration-300 animate-in fade-in"
        >
          <p className="text-[15px] font-semibold tracking-tight text-foreground">
            {active.title}
          </p>
          {active.subtitle && (
            <p className="mt-1 text-[13px] text-muted-foreground">
              {active.subtitle}
            </p>
          )}
          {active.meta && active.meta.length > 0 && (
            <dl className="mt-10 w-full max-w-[230px] text-[12px]">
              {active.meta.map((row) => (
                <div key={row.label} className="flex justify-between py-[5px]">
                  <dt className="text-muted-foreground">{row.label}</dt>
                  <dd className="font-medium text-foreground">{row.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      )}

      {showPagination && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === selected}
              onClick={() => goTo(index)}
              className={cn(
                "size-2 rounded-full bg-foreground transition-opacity",
                index === selected ? "opacity-100" : "opacity-30",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
