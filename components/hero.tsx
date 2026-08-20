import ParallaxHero from "@/components/ui/parallax-scrolling";
import { company } from "@/lib/site";

export default function Hero() {
  return (
    <ParallaxHero
      src="/images/diverz-hero.jpg"
      videoSrc="/videos/hero-v2.mp4"
      slogan={company.slogan}
      tagline={"다이버즈와 함께하면\n놀라운 변화를 경험할 수 있습니다"}
    />
  );
}
