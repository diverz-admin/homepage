import {
  CoverflowCarousel,
  type CoverflowSlide,
} from "@/components/ui/coverflow-carousel";
import GradientLine from "@/components/gradient-line";
import Reveal from "@/components/reveal";
import { services } from "@/lib/site";

/**
 * 서비스 프리뷰 — 5개 서비스를 커버플로우 캐러셀로 보여준다. 가운데 카드가
 * 정면을 보고, 양옆 카드는 뒤로 젖혀지며 멀어진다(components/ui/coverflow-carousel.tsx).
 * 드래그·화살표 키·좌우 버튼·페이지네이션 점으로 넘길 수 있다.
 */
const SERVICE_SLIDES: CoverflowSlide[] = services.map((service) => ({
  src: service.image,
  alt: service.name,
  title: service.en,
  subtitle: service.name,
  // 정면 카드를 누르면 그 상품의 서비스 페이지로 간다.
  href: `/service/${service.slug}`,
}));

export default function ServiceStack() {
  return (
    <section className="on-light bg-white py-28 sm:py-40">
      <div className="page-container">
        {/* client-logos의 PARTNERS 타이틀과 같은 형식 — 가운데 정렬한
            eyebrow + 큰 제목 한 줄. */}
        <Reveal>
          <p className="text-center font-display text-xs font-bold tracking-[0.35em] text-accent">
            SERVICE
          </p>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="mt-5 text-center font-display text-fluid-2xl font-bold leading-tight tracking-tight text-abyss">
            <GradientLine>브랜드에 필요한 모든 실행을 다이버즈에서</GradientLine>
          </h2>
        </Reveal>
      </div>

      {/* 캐러셀만 page-container 밖으로 뺀다 — 좌우 여백 없이 화면 폭을 꽉
          채워야 옆 카드가 화면 끝까지 이어지며 링이 계속 도는 인상이 난다.
          제목은 그대로 컨테이너 안이라 다른 섹션과 왼쪽 기준선이 맞는다. */}
      <div className="mt-16 sm:mt-20">
        <CoverflowCarousel
          slides={SERVICE_SLIDES}
          label="다이버즈 서비스"
          cardWidth="clamp(220px, 26vw, 480px)"
          showNavigation
          showPagination
        />
      </div>
    </section>
  );
}
