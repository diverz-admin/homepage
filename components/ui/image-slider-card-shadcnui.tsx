"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useId, useState } from "react";

interface Slide {
  id: number;
  image: string;
  title: string;
  description: string;
}

/**
 * 중국 이커머스 입점 마케팅 — 입점 인프라 파트너가 실제로 제공하는 기능 셋.
 * 이미지는 정확한 실사 대신 각 주제(물류창고 · 결제 · 현지 라이브커머스)에
 * 맞는 Unsplash 스톡 사진으로 채웠다. 파트너사 이름은 화면에 쓰지 않는다는
 * 원칙(lib/site.ts의 ecommerceMarketing 주석 참고)에 따라, 현지 매칭
 * 플랫폼도 브랜드명 대신 기능으로 설명한다. 결제·물류사 로고는 이 원칙과
 * 무관한 중립적 인프라 브랜드라 그대로 남긴다(Alipay·Stripe 등).
 *
 * 원본 shadcn 스니펫은 bg-card/border-border/bg-primary를 쓰는데, 이 사이트는
 * 그 이름의 토큰이 없다(app/globals.css는 --card·--primary를 정의하지 않는다).
 * border-border/ring-ring은 각각 --line·--accent로 매핑돼 있어 그대로 두고,
 * bg-card → bg-white, bg-primary → bg-accent로 바꿔 이 페이지의 다른 흰 카드
 * (COST·CHANNELS 등)와 같은 팔레트를 쓰게 한다.
 *
 * 원본은 슬라이드 전환에 framer-motion의 AnimatePresence(mode="wait")를
 * 썼는데, 이 프로젝트의 framer-motion 12.42.2 조합에서 두 번째 전환부터
 * 다음 슬라이드가 마운트되지 않고 첫 슬라이드에 멈추는 게 실측으로
 * 확인됐다(브라우저에서 상태를 직접 찍어 확인 — currentIndex는 바뀌는데
 * AnimatePresence 자식만 멈춘다). 그 대신 key로 다시 마운트될 때 CSS
 * 애니메이션이 스스로 재생되는 성질을 빌린다(app/globals.css의
 * slide-fade-in · slide-image-in) — 라이브러리 상태 추적에 기대지 않아
 * 같은 문제가 생기지 않는다.
 */

/**
 * 자동 넘김 간격(ms). 본문이 두세 줄이라 다 읽고 다음 장으로 넘어가려면
 * 이 정도는 있어야 한다 — 더 짧으면 문장을 읽는 도중에 화면이 바뀐다.
 */
const AUTOPLAY_MS = 5000;
const slides: Slide[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80",
    title: "가장 적합한 4PL 풀필먼트",
    description:
      "해외 보세창고, 로컬 집합창고, 집하창고까지 상황에 맞는 창고 모드를 제공하고, 차이냐오/제이디물류 등 검증된 물류사와 함께 최저가로 배송/창고 비용을 관리합니다.",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
    title: "빠르고 안전한 정산",
    description:
      "여러 플랫폼의 정산을 한 곳에서 일괄 관리하고, 24시간 수시 출금과 T+1 해외송금으로 빠르게 입금받습니다. Alipay/WeChat Pay/PayPal/Stripe 등 주요 결제사와 연동되어 있습니다.",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80",
    title: "현지 인플루언서 기반 B2B 커머스",
    description:
      "싱가포르/말레이시아/대만 등 현지 전문 MCN과 인플루언서를 라이브 셀러와 연결해, 소싱부터 라이브 판매/거래까지 이어지는 B2B 구조를 지원합니다.",
  },
];

export function ImageSliderCard() {
  const [currentIndex, setCurrentIndex] = useState(0);
  /** 마우스가 올라와 있거나 키보드 포커스가 안에 있으면 자동 넘김을 멈춘다. */
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const headingId = useId();
  const descriptionId = useId();
  const tablistId = useId();

  const slideCount = slides.length;

  const paginate = (newDirection: number) => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) return slideCount - 1;
      if (nextIndex >= slideCount) return 0;
      return nextIndex;
    });
  };

  const goToSlide = (index: number) => {
    if (index === currentIndex) return;
    setCurrentIndex(index);
  };

  /**
   * 자동 넘김.
   *
   * currentIndex 를 의존성에 넣어 둔 게 핵심이다 — 사용자가 화살표나 점을
   * 눌러 직접 넘기면 그 순간 타이머가 새로 시작한다. 방금 넘긴 장이
   * 남은 시간만큼만 보이고 곧바로 다음으로 밀리는 일이 없다.
   *
   * 모션 최소화 설정에서는 아예 돌리지 않는다. 스스로 움직이는 화면은
   * 그 설정이 가장 먼저 걷어 내야 할 종류다 — 화살표·점·좌우 키가
   * 그대로 남아 있어 손으로 넘기는 데는 지장이 없다.
   */
  useEffect(() => {
    if (shouldReduceMotion || isPaused) return;

    const timer = window.setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slideCount);
    }, AUTOPLAY_MS);

    return () => window.clearTimeout(timer);
  }, [currentIndex, isPaused, shouldReduceMotion, slideCount]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowLeft": {
        event.preventDefault();
        paginate(-1);
        break;
      }
      case "ArrowRight": {
        event.preventDefault();
        paginate(1);
        break;
      }
      case "Home": {
        event.preventDefault();
        goToSlide(0);
        break;
      }
      case "End": {
        event.preventDefault();
        goToSlide(slideCount - 1);
        break;
      }
      default:
        break;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
      /* 폭 상한(max-w-3xl)은 걷었다 — 쓰는 쪽에서 2단 그리드의 한 칸에
         넣으므로 칸이 이미 폭을 정한다. 상한을 두면 그만큼이 칸 안에서
         빈 자리로 남는다(components/ecommerce-marketing.tsx의 FEATURES). */
      className="rounded-2xl w-full bg-white border border-gray-200 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      role="group"
      aria-roledescription="carousel"
      aria-label="입점 인프라 기능 소개 슬라이드"
      /* 저절로 넘어가는 동안에는 live region 을 끈다 — 5초마다 화면
         낭독기가 새 제목을 읽어 대면 페이지의 다른 곳을 듣고 있던 사람의
         말을 계속 끊는다. 멈춰 있을 때(손을 얹었거나 포커스가 안에 있을
         때, 또는 모션 최소화 설정)만 켜서, 사용자가 직접 넘긴 결과는
         제대로 읽히게 한다. */
      aria-live={isPaused || shouldReduceMotion ? "polite" : "off"}
      aria-atomic="true"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* Image Slider */}
      <div className="relative h-96 bg-muted overflow-hidden">
        {/* key로 매번 새 엘리먼트를 마운트해 slide-image-in이 그때마다
            처음부터 다시 재생되게 한다(위 주석 참고). */}
        <img
          key={currentIndex}
          src={slides[currentIndex]?.image}
          /* 원본 레시피는 grayscale 을 걸어 두는데, 이 지면에서는 컬러로
             둔다 — 창고·물류 사진이 흑백이면 실제 운영 현장이 아니라
             무드 이미지처럼 읽힌다. */
          className="slide-image-in absolute w-full h-full object-cover focus-visible:outline-none"
          alt={slides[currentIndex]?.title}
          role="img"
          aria-describedby={descriptionId}
          aria-labelledby={headingId}
        />

        {/* Navigation Buttons */}
        <button
          type="button"
          onClick={() => paginate(-1)}
          className=" absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background border border-gray-200 flex items-center justify-center hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-full"
          aria-label="이전 슬라이드"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => paginate(1)}
          className=" absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background border border-gray-200 flex items-center justify-center hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-full"
          aria-label="다음 슬라이드"
        >
          <ChevronRight
            className="w-5 h-5 text-foreground"
            aria-hidden="true"
          />
        </button>

        <span className="sr-only" role="status">
          슬라이드 {currentIndex + 1} / {slideCount}
        </span>
      </div>

      {/* Content */}
      <div
        className="p-8 border-t border-gray-200"
        role="tablist"
        aria-label="슬라이드 탐색"
        id={tablistId}
      >
        <div
          key={currentIndex}
          className="slide-fade-in"
          role="tabpanel"
          aria-labelledby={headingId}
          id={`slide-panel-${slides[currentIndex]?.id ?? "unknown"}`}
        >
          <h2
            id={headingId}
            className="text-2xl font-semibold text-foreground mb-2"
          >
            {slides[currentIndex]?.title}
          </h2>
          <p
            id={descriptionId}
            className="text-muted-foreground leading-relaxed"
            aria-live="polite"
          >
            {slides[currentIndex]?.description}
          </p>
        </div>

        {/* Dot Indicators */}
        <div className="flex items-center gap-2 mt-6">
          {slides.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(index)}
                className={`rounded-full h-1.5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  isActive
                    ? "w-8 bg-accent"
                    : "w-1.5 bg-muted hover:bg-muted/80"
                }`}
                aria-label={`${index + 1}번째 슬라이드로 이동`}
                role="tab"
                aria-selected={isActive}
                aria-controls={`slide-panel-${slide.id}`}
                tabIndex={isActive ? 0 : -1}
                id={`slide-tab-${slide.id}`}
              >
                <span className="sr-only">
                  {slide.title} ({index + 1} / {slideCount})
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default ImageSliderCard;
