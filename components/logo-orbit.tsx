import type { CSSProperties } from "react";
import { imcChannels } from "@/lib/site";

/**
 * IMC 채널 로고를 원형 궤도에 걸고 천천히 돌린다. (서비스 페이지 IMC 블록)
 *
 * 고리 하나만 쓴다. 두 겹으로 만들면 안쪽 고리가 바깥 고리와 다른 속도로
 * 돌다가 같은 각도에서 만나 칩끼리 겹친다 — 겹치지 않을 만큼 반지름을
 * 벌리면 안쪽 고리가 너무 작아져 로고를 못 읽는다.
 *
 * 고리가 도는 동안 칩은 같은 주기로 반대 회전을 걸어 로고가 늘 똑바로 선다.
 * 애니메이션은 전부 CSS(globals.css의 .logo-orbit-*)라 클라이언트 컴포넌트가
 * 아니고, prefers-reduced-motion에서는 회전이 멈춘다.
 */

/**
 * 궤도에 거는 로고. imcChannels가 곧 궤도에 걸리는 목록이다 —
 * 개수를 늘리려면 --orbit도 같이 키워야 칩이 서로 닿지 않는다.
 */
const ORBIT_LOGOS = imcChannels;

export default function LogoOrbit() {
  return (
    <div
      className="logo-orbit relative"
      // 칩 크기는 고정(rem)이고 궤도 지름만 화면 폭을 따라간다.
      style={
        {
          "--orbit": "clamp(19rem, 24vw, 27rem)",
          "--r": "calc(var(--orbit) / 2 - 2.6rem)",
        } as CSSProperties
      }
    >
      {/* 궤도선 — 칩이 정확히 이 원 위에 앉는다. */}
      <span
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-abyss/10"
        style={{ width: "calc(var(--r) * 2)", height: "calc(var(--r) * 2)" }}
      />
      <span
        className="logo-orbit-ring absolute inset-0"
        style={{ "--dur": "58s" } as CSSProperties}
      >
        {ORBIT_LOGOS.map((logo, i) => (
          <span
            key={logo.name}
            className="logo-orbit-item"
            style={
              { "--a": `${(360 / ORBIT_LOGOS.length) * i}deg` } as CSSProperties
            }
          >
            <span
              className="logo-orbit-chip flex size-[5.2rem] items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_2px_12px_rgb(10_21_38/0.07)] ring-1 ring-abyss/10"
              style={{ "--dur": "58s" } as CSSProperties}
            >
              {/* 캔버스가 이미 안전 여백을 갖고 있어서 칩에 padding을 주지
                  않는다(주면 이중으로 들어가 로고가 작아진다).
                  원본 비율을 그대로 살려야 해서 next/image 대신 img를 쓴다. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.src}
                alt={logo.name}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain"
              />
            </span>
          </span>
        ))}
      </span>
    </div>
  );
}
