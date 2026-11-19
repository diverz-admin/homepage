import Image from "next/image";
import Reveal from "@/components/reveal";
import coupangFoot from "@/public/images/landing/scroll-coupang-foot.jpg";
import coupangHead from "@/public/images/landing/scroll-coupang-head.jpg";
import coupangStrip from "@/public/images/landing/scroll-coupang-strip.jpg";
import naverFoot from "@/public/images/landing/scroll-naver-foot.jpg";
import naverHead from "@/public/images/landing/scroll-naver-head.jpg";
import naverStrip from "@/public/images/landing/scroll-naver-strip.jpg";

/**
 * 구좌별 반응 분포도 — 검색 결과 화면 두 개(네이버 쇼핑형 격자 / 쿠팡형
 * 2열) 위에 "위쪽일수록 반응이 몰린다"는 열지도를 덮은 개념 그림.
 *
 * 받은 레퍼런스(빨강~노랑 열지도 + 실제 쇼핑 앱 캡처)를 다이버즈 톤으로
 * 다시 그렸다. 화면 속은 실제 검색 결과(네이버 쇼핑/쿠팡 휴대폰 화면 녹화를
 * 이어 붙인 긴 한 장)가 일정한 속도로 내려간다. 열지도는 사용자 요청으로 위 빨강 →
 * 아래 파랑(accent) 그라데이션이다(사이트에서 빨강을 쓰는 예외 자리). 수치가 없는
 * 개념 그림이라 설문/출처 같은 근거 문구는 붙이지 않는다.
 *
 * 화면에 들어오면 열지도가 위에서부터 차오른다.
 */

/**
 * 실제 검색 결과 화면. 휴대폰 녹화를 이어 붙여 만든 긴 한 장(strip)을
 * 머리(검색창)/바닥(하단 메뉴) 사이 칸에서 같은 속도로 계속 내린다.
 * 녹화의 손가락 스크롤은 빨랐다 느렸다 해서 그대로 쓰지 않는다.
 * 속도는 길이와 상관없이 같도록 duration 을 strip 길이에 맞춘다.
 */
const SCREENS = {
  naver: { head: naverHead, strip: naverStrip, foot: naverFoot, sec: 22 },
  coupang: {
    head: coupangHead,
    strip: coupangStrip,
    foot: coupangFoot,
    sec: 29,
  },
} as const;

function Phone({
  label,
  screen,
  delay,
}: {
  label: string;
  screen: keyof typeof SCREENS;
  delay: number;
}) {
  const { head, strip, foot, sec } = SCREENS[screen];
  return (
    <figure className="flex flex-col items-center">
      <div className="relative w-[min(calc((100vw_-_60px)/2),220px)] overflow-hidden rounded-[1.4rem] border border-white/15 bg-white shadow-[0_18px_50px_rgb(0_0_0/0.45)] sm:w-[230px] lg:w-[260px]">
        <div aria-hidden className="flex aspect-[9/17] flex-col">
          <Image src={head} alt="" sizes="260px" className="h-auto w-full" />
          <div className="relative min-h-0 flex-1 overflow-hidden">
            <Image
              src={strip}
              alt=""
              sizes="260px"
              className="slot-scroll absolute inset-0 h-full w-full object-cover"
              style={{ animationDuration: `${sec}s` }}
            />
          </div>
          <Image src={foot} alt="" sizes="260px" className="h-auto w-full" />
        </div>

        {/* 열지도 — 위는 빨강(반응 매우 높음), 아래로 갈수록 파랑(낮음).
            화면에 들어오면 위에서부터 차오른다. */}
        <Reveal
          as="div"
          delay={delay}
          className="group/heat pointer-events-none absolute inset-0 block"
        >
          <span
            aria-hidden
            className="absolute inset-0 block bg-gradient-to-b from-[#ff4d5e]/70 via-[#c45ad8]/35 via-45% to-accent/45 mix-blend-multiply [clip-path:inset(0_0_100%_0)] transition-[clip-path] duration-[1400ms] ease-out group-data-[visible=true]/heat:[clip-path:inset(0_0_0_0)]"
          />
        </Reveal>
      </div>
      <figcaption className="mt-3 text-xs font-medium text-white/50 sm:text-sm">
        {label}
      </figcaption>
    </figure>
  );
}

/**
 * 긴 한 장을 위에서 아래까지 일정한 속도로 내린다(object-position 0% → 100%).
 * 끝에서 잠깐 멈췄다가 처음으로 돌아간다. 움직임 줄이기면 멈춘다.
 */
const SCROLL_CSS = `
@keyframes slot-scroll { 0% { object-position: 50% 0%; } 94%, 100% { object-position: 50% 100%; } }
.slot-scroll { animation: slot-scroll 20s linear infinite; }
@media (prefers-reduced-motion: reduce) { .slot-scroll { animation: none; } }
`;

export default function SlotHeatmap({
  phones,
  high,
  low,
  caption,
  note,
}: {
  phones: readonly [string, string];
  high: string;
  low: string;
  caption: string;
  note: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <style>{SCROLL_CSS}</style>
      {/* 모바일에서는 휴대폰 두 대를 화면 폭에 맞춰 키운다 — 둘 + 눈금이
          화면 양옆 12px 만 남기고 꽉 차도록(page-container 여백 안쪽을 조금
          넘어선다). sm 부터는 고정 폭. */}
      <div className="flex items-stretch gap-1.5 sm:gap-6">
        <Phone label={phones[0]} screen="naver" delay={100} />

        {/* 가운데 눈금 — 위 "매우 높음", 아래 "낮음" */}
        <div
          aria-hidden
          className="flex flex-col items-center pb-8 text-center text-[0.6rem] leading-tight font-bold text-white/60 sm:text-xs"
        >
          <span className="whitespace-pre-line">{high}</span>
          <span className="my-2 block w-[3px] sm:my-3 flex-1 rounded-full bg-gradient-to-b from-[#ff4d5e] via-[#c45ad8] to-accent" />
          <span>{low}</span>
        </div>

        <Phone label={phones[1]} screen="coupang" delay={250} />
      </div>

      <p className="mt-8 text-sm font-bold text-white sm:text-base">
        {caption}
      </p>
      <p className="mt-1.5 text-xs text-white/45 sm:text-sm">{note}</p>
    </div>
  );
}
