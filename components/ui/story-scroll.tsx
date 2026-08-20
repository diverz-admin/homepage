'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

/**
 * 프로젝트의 cn(twMerge) 대신 단순 join을 쓴다.
 * twMerge는 같은 그룹의 유틸리티를 뒤엣것만 남기고 지우는데, 여기 기본
 * 클래스(min-h-screen, px-[4vw] …)는 호출부가 덮어쓰라고 둔 게 아니라
 * 스크롤 효과가 기대는 레이아웃이라 지워지면 안 된다.
 */
function cx(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(' ');
}

export interface FlowSectionProps {
  className?: string;
  /** 안쪽 패널(.flow-art-container)에 붙는다 — 배경색·글자색·여백을 여기서 준다. */
  style?: React.CSSProperties;
  children: React.ReactNode;
  'aria-label'?: string;
}

export const FlowSection: React.FC<FlowSectionProps> = ({
  className,
  style = {},
  children,
  'aria-label': ariaLabel,
}) => (
  <section
    data-flow-section
    aria-label={ariaLabel}
    className={cx('relative min-h-screen w-full overflow-hidden', className)}
  >
    <div
      data-flow-inner
      className={cx(
        'flow-art-container relative flex min-h-screen w-full flex-col justify-between gap-6 px-[4vw] pt-[clamp(2rem,8vw,4vw)] pb-[4vw]',
        'will-change-transform',
      )}
      style={{ transformOrigin: 'bottom left', ...style }}
    >
      {children}
    </div>
  </section>
);

export interface FlowArtProps {
  children: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}

const childCount = (children: React.ReactNode) => React.Children.count(children);

/**
 * 섹션이 아래에서 30도 기울어진 채 들어와 제자리로 펴지고, 다 펴진 섹션은
 * 화면에 고정된 채 다음 섹션에 덮인다. 섹션마다 배경색이 다르면 넘어가는
 * 지점이 또렷하게 끊긴다.
 *
 * 효과는 sm(640px) 이상에서만 건다. 이 연출은 "한 섹션 = 한 화면"을 전제로
 * 하는데, 좁은 화면에서는 같은 내용이 세로로 길어져 섹션이 화면보다 커진다.
 * 그러면 아직 다 읽지 않은 아래쪽을 다음 섹션이 덮어 버려서, 마지막 항목이
 * 잘린 것처럼 보인다. 효과를 끄면 섹션들이 그냥 세로로 쌓이고 배경색 차이는
 * 그대로 남아 구분감도 유지된다.
 *
 * prefers-reduced-motion에서도 같은 이유로 효과를 걸지 않는다.
 */
const FlowArt: React.FC<FlowArtProps> = ({
  children,
  className,
  'aria-label': ariaLabel = 'Story scroll',
}) => {
  const containerRef = useRef<HTMLElement>(null);
  /* 서버 렌더에서는 화면 폭을 알 수 없으므로 꺼진 상태로 시작한다.
     마운트 직후 판단해서 켜므로 첫 페인트가 어긋나지 않는다. */
  const [effectsOn, setEffectsOn] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const wide = window.matchMedia('(min-width: 640px)');
    const update = () => setEffectsOn(!reduced.matches && wide.matches);
    update();
    reduced.addEventListener('change', update);
    wide.addEventListener('change', update);
    return () => {
      reduced.removeEventListener('change', update);
      wide.removeEventListener('change', update);
    };
  }, []);

  useGSAP(
    () => {
      if (!containerRef.current || !effectsOn) return;

      const sections = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>('[data-flow-section]'),
      );
      if (sections.length === 0) return;

      const triggers: ScrollTrigger[] = [];

      sections.forEach((section, i) => {
        gsap.set(section, { zIndex: i + 1 });

        const inner = section.querySelector<HTMLElement>('.flow-art-container');
        if (!inner) return;

        if (i > 0) {
          gsap.set(inner, { rotation: 30, transformOrigin: 'bottom left' });
          const tween = gsap.to(inner, {
            rotation: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'top 25%',
              scrub: true,
            },
          });
          if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
        }

        if (i < sections.length - 1) {
          triggers.push(
            ScrollTrigger.create({
              trigger: section,
              start: 'bottom bottom',
              end: 'bottom top',
              pin: true,
              pinSpacing: false,
            }),
          );
        }
      });

      ScrollTrigger.refresh();

      /* 핀은 고정되는 시점의 높이를 재서 인라인 height/max-height로 굳힌다.
         그 뒤에 내용이 더 높아지면(웹폰트가 늦게 붙거나 이미지가 들어오거나)
         굳은 높이가 실제보다 작아지고, 섹션의 overflow-hidden이 넘치는 만큼을
         잘라 낸다 — 마지막 단계가 통째로 안 보이는 증상이 이것이다.
         그래서 (1) 폰트가 다 붙은 뒤, (2) 안쪽 높이가 바뀔 때마다 다시 잰다.

         관찰 대상은 섹션이 아니라 안쪽 컨테이너다. refresh()가 바꾸는 건
         섹션 높이라, 섹션을 보면 스스로를 다시 부르는 고리가 생긴다. */
      let raf = 0;
      const refresh = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => ScrollTrigger.refresh());
      };

      document.fonts?.ready.then(refresh);

      const observer = new ResizeObserver(refresh);
      sections.forEach((section) => {
        const inner = section.querySelector<HTMLElement>('.flow-art-container');
        if (inner) observer.observe(inner);
      });

      return () => {
        cancelAnimationFrame(raf);
        observer.disconnect();
        triggers.forEach((t) => t.kill());
      };
    },
    { scope: containerRef, dependencies: [childCount(children), effectsOn] },
  );

  return (
    <main
      ref={containerRef}
      aria-label={ariaLabel}
      className={cx('w-full overflow-x-hidden', className)}
    >
      {children}
    </main>
  );
};

export default FlowArt;
