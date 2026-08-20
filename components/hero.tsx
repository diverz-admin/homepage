import ParallaxHero from "@/components/ui/parallax-scrolling";
import { company } from "@/lib/site";

/**
 * 히어로 제목 좌우에 거는 서비스 목록. services(lib/site.ts)와 순서는
 * 같지만 표기는 영문 약칭(예: "퍼포먼스 마케팅" 대신 "Performance")으로
 * 짧게 줄인다 — 큰 제목 옆에 거는 장식적 목록이라 항목명이 길면 무거워진다.
 */
const HERO_SERVICE_LINKS = [
  { href: "/service#imc", label: "IMC Marketing" },
  { href: "/service#performance", label: "Performance" },
  { href: "/service#viral", label: "Viral Solution" },
  { href: "/service#global", label: "Global" },
  { href: "/service#contents", label: "Contents" },
] as const;

export default function Hero() {
  return (
    <ParallaxHero
      src="/images/diverz-hero.jpg"
      videoSrc="/videos/hero-v3.mp4"
      slogan={company.slogan}
      serviceLinks={HERO_SERVICE_LINKS}
    />
  );
}
