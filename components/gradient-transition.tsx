"use client";

import { useEffect, useRef } from "react";

/**
 * 흰 섹션 → 심해 섹션 사이를 잇는 그라디언트 띠 + 그 위에 뜨는 두 줄.
 *
 * 두 섹션이 맞닿는 자리에 흰색과 남색이 선으로 갈라지던 걸 없앤다. 띠는
 * 그냥 고정 그라디언트가 아니라, 스크롤 진행도(--p, 0→1)를 받아 파랑이
 * 아래에서 위로 차오른다 — 내려갈수록 물속으로 들어가는 사이트 동선과
 * 같은 방향이다.
 *
 * 같은 --p로 문구 두 줄도 순서대로 띄운다. "Dive Deeper"가 먼저 떠오르고,
 * 조금 더 내려가면 "Grow Faster"가 따라 뜬다. 구간 값과 색은 전부
 * globals.css의 `.gradient-transition` / `.dive-line*`에 있다.
 *
 * 진행도는 "띠의 아래끝이 화면 아래에 닿는 순간(0) → 띠의 위끝이 화면
 * 위로 빠지는 순간(1)"으로 잡는다. 스크롤 이벤트마다 계산하지 않고
 * rAF로 한 프레임에 한 번만 접어 준다.
 *
 * 높이는 두 줄이 차례로 뜰 스크롤 길이가 필요해서 화면보다 길게 잡는다.
 * 문구는 그 안에서 sticky로 화면 가운데에 붙어 있는다.
 */
export default function GradientTransition({
  className = "h-[140svh]",
}: {
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const travel = rect.height + window.innerHeight;
      const p = Math.min(
        1,
        Math.max(0, (window.innerHeight - rect.top) / travel),
      );
      el.style.setProperty("--p", p.toFixed(3));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={ref} className={`gradient-transition relative ${className}`}>
      {/* sticky 레이어를 화면(100svh)이 아니라 65svh로 잡는다. 화면 높이로 두면
          고정이 풀리는 순간 띠 아래끝이 화면 아래끝과 겹쳐서, 문구 아래로 반
          화면이 빈 채 다음 섹션을 기다리게 된다. 레이어를 낮추면 그만큼 다음
          섹션이 일찍 화면에 들어온다 — 문구는 화면 중앙보다 살짝 위에 앉는다.
          이 값을 고치면 globals.css의 리빌 구간도 같이 맞춰야 한다. */}
      {/* 글자 크기는 clamp(2rem, 7.5vw, 3.1rem).
          하한을 2rem(32px)까지 올린 건 모바일 때문이다 — 예전 하한 1.4rem은
          390px 화면에서 22px밖에 안 돼, 화면을 채우는 한 줄짜리 선언문치고
          본문과 구분이 안 됐다. 증가율(7.5vw)도 같이 올려 480px 부근부터
          바로 상한에 가까워지게 했다. 상한은 그대로라 데스크톱은 변화 없다. */}
      <div className="sticky top-0 flex h-[65svh] flex-col items-center justify-center px-6 text-center">
        <p className="dive-line dive-line-1 font-sans text-[clamp(2rem,7.5vw,3.1rem)] font-black tracking-tight text-white italic drop-shadow-[0_4px_30px_rgb(10_21_38_/_0.55)]">
          DIVE DEEPER
        </p>
        <p className="dive-line dive-line-2 font-sans text-[clamp(2rem,7.5vw,3.1rem)] font-black tracking-tight text-white italic drop-shadow-[0_4px_30px_rgb(10_21_38_/_0.55)]">
          GROW FASTER
        </p>
      </div>
    </div>
  );
}
