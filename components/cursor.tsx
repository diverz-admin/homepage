"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 커서 위치의 요소에서 조상을 거슬러 올라가며 처음 만나는 불투명 배경색을 찾아,
 * 그 밝기(luminance)로 "밝은 배경인지"를 판단한다. 못 찾으면 어두운(기본) 배경으로 본다.
 */
function isLightBackground(target: Element | null): boolean {
  let el: Element | null = target;
  while (el && el !== document.documentElement) {
    const bg = getComputedStyle(el).backgroundColor;
    const match = bg.match(
      /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/
    );
    if (match) {
      const [r, g, b] = [Number(match[1]), Number(match[2]), Number(match[3])];
      const a = match[4] === undefined ? 1 : Number(match[4]);
      // 반투명 배경은 아래 색이 비치므로 무시하고 계속 위로 올라간다.
      if (a >= 0.5) {
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b; // 0–255
        return luminance > 160;
      }
    }
    el = el.parentElement;
  }
  return false;
}

/**
 * 커스텀 커서.
 * 마우스가 있는 기기(fine pointer)에서만 동작한다 — 터치 기기에서 켜면
 * 기본 커서만 사라지고 대체 커서는 따라올 게 없어 아무것도 안 보인다.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const sync = () => setEnabled(fine.matches);

    const frame = requestAnimationFrame(sync);
    fine.addEventListener("change", sync);
    return () => {
      cancelAnimationFrame(frame);
      fine.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.dataset.cursor = "custom";

    let frame = 0;
    let x = 0;
    let y = 0;

    const onMove = (event: MouseEvent) => {
      x = event.clientX;
      y = event.clientY;

      // 포인터 이벤트는 프레임보다 자주 오므로 rAF로 한 번만 그린다.
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const dot = dotRef.current;
        if (!dot) return;
        dot.style.left = `${x}px`;
        dot.style.top = `${y}px`;

        // 클릭 가능한 요소 위에서는 커서를 키운다.
        const target = document.elementFromPoint(x, y);
        const interactive = target?.closest(
          "a, button, input, textarea, select, [role='button']"
        );
        dot.dataset.hover = interactive ? "true" : "false";

        // 커서 아래 배경의 밝기를 감지해 밝은 배경에선 어두운 커서로 바꾼다.
        dot.dataset.onLight = isLightBackground(target) ? "true" : "false";
      });
    };

    const onLeave = () => {
      if (dotRef.current) dotRef.current.dataset.visible = "false";
    };
    const onEnter = () => {
      if (dotRef.current) dotRef.current.dataset.visible = "true";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      delete document.documentElement.dataset.cursor;
    };
  }, [enabled]);

  if (!enabled) return null;

  return <div ref={dotRef} className="cursor" data-visible="true" aria-hidden />;
}
