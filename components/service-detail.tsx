import Image from "next/image";

import GlobalMarketingTabs from "@/components/global-marketing-tabs";
import PerformanceFunnel from "@/components/performance-funnel";
import ServiceSection from "@/components/service-section";
import { Feature as ImcWhyDiverz } from "@/components/ui/feature-section-with-bento-grid";
import ViralChannels from "@/components/viral-channels";
import { services } from "@/lib/site";

/**
 * 상품마다 본문 오른쪽에 세우는 개념도.
 *
 * 다섯 장이 한 벌로 그려진 그림이다 — 흰 배경, 남색 그라디언트 도형, 그
 * 둘레에 점과 라벨. 그래서 컴포넌트로 따로 그리지 않고 이미지로 받는다.
 * (예전에는 IMC만 로고 궤도, 퍼포먼스는 로고 그리드, 글로벌은 사진…처럼
 * 상품마다 다른 컴포넌트를 붙여서 다섯 페이지의 결이 제각각이었다.)
 *
 * 파일명에 diagram- 을 붙여 새로 깔았다. /public 파일은 이름에 해시가 붙지
 * 않아서, 같은 이름으로 그림만 갈아 끼우면 Next 이미지 최적화 캐시·브라우저·
 * CDN이 옛 그림을 계속 물고 있는다. 그림을 새로 받을 때는 파일명도 바꾼다.
 *
 * 크기는 원본 픽셀 그대로 적는다(Next가 비율 계산에 쓴다). 화면에서의 폭은
 * components/service-section.tsx 의 그래픽 칸이 정한다.
 */
const diagrams: Record<
  string,
  {
    src: string;
    width: number;
    height: number;
    alt: string;
    /**
     * 화면에서의 최대 폭(px). 안 적으면 540.
     *
     * 다섯 장의 세로 비율이 제각각이라(0.60 ~ 0.75) 폭을 똑같이 주면
     * 홀쭉한 그림일수록 세로로 훨씬 길어진다. 유난히 커 보이는 장만
     * 여기서 따로 줄인다.
     */
    maxWidth?: number;
    /**
     * 그림 위쪽에 남아 있는 흰 여백(원본 픽셀).
     *
     * 다섯 장 모두 배경이 흰색으로 구워져 있어서, 상자를 제목에 딱 맞춰도
     * 그림 자체는 이 여백만큼 아래에서 시작한다(IMC는 104px = 높이의 7%).
     * 그만큼 음수 여백으로 끌어올려 그림의 윗선을 제목의 윗선에 맞춘다.
     *
     * px 가 아니라 폭 대비 %로 환산해 쓴다 — 화면이 좁아 그림이 줄어들면
     * 여백도 같은 비율로 줄어야 한다. 그림을 새로 받으면 값도 다시 재야
     * 한다(scripts 없이 잰다면: 흰색이 아닌 첫 행까지의 픽셀 수).
     */
    inkTop?: number;
    /**
     * 그래픽을 화면 오른쪽 끝까지 흘려보낼지(components/service-section.tsx).
     *
     * 블루에그처럼 화면 안을 읽어야 하는 그림에만 켠다. 켜면 폭 상한(maxWidth)을
     * 두지 않고 칸을 꽉 채운다 — 상한을 두면 흘려보낸 만큼이 그대로 빈 여백이
     * 된다.
     */
    bleedRight?: boolean;
  }
> = {
  imc: {
    src: "/images/service/diagram-imc.png",
    inkTop: 104,
    width: 1086,
    height: 1448,
    alt: "IMC 마케팅이 묶는 영역 — 전략수립, SA 마케팅, 브랜드 아이덴티티, 데이터 분석, DA 마케팅, 콘텐츠 마케팅, 오프라인 마케팅",
  },
  performance: {
    src: "/images/service/diagram-performance-v2.png",
    inkTop: 30,
    width: 1023,
    height: 1473,
    // 세로 720px 기준 폭 — 아래 세 장 모두 같은 기준으로 맞췄다.
    maxWidth: 500,
    alt: "퍼포먼스 마케팅 운영 흐름 — 전략 수립, 소재 제작, 성과 최적화, 성과 분석. 구글/메타/틱톡/유튜브 채널을 함께 운영합니다",
  },
  viral: {
    /* 바이럴은 개념도 대신 블루에그 플랫폼 화면을 세운다 — 이 상품의
       실행이 결국 그 플랫폼 위에서 돌아가므로, 추상적인 도식보다 실물이
       먼저 오는 편이 읽힌다. 예전 휴대폰 개념도(diagram-viral)는 뺐다. */
    src: "/images/service/blueegg.png",
    inkTop: 41,
    // 노트북 화면 안의 대시보드가 읽혀야 하는 그림이라 끝까지 흘려보낸다.
    bleedRight: true,
    width: 1536,
    height: 1024,
    alt: "블루에그 셀프 마케팅 플랫폼 화면 — 통합순위관리, 리워드 마케팅 캠페인 현황, 채널별 키워드 순위 추적",
  },
  contents: {
    src: "/images/service/diagram-contents-v2.png",
    inkTop: 50,
    width: 974,
    height: 1431,
    // 세로 720px 기준 폭.
    maxWidth: 490,
    alt: "콘텐츠 제작 과정 — 리서치 및 기획, 스토리보드 제작, 촬영 준비, 촬영, 편집 및 후반작업",
  },
};

/**
 * 상품 한 종의 본문. /service/[slug]에서 쓴다.
 *
 * 오른쪽 개념도는 위 diagrams에서 slug로 고르고, 본문 아래에는 상품별로
 * 딸린 블록이 이어진다 — 지금은 바이럴(채널 목록)뿐이다.
 *
 * 글로벌만 예외로 대제목 블록 자체가 없다 — 아래 early return 참고.
 *
 * 프로세스 타임라인은 한때 둘 다(IMC PROCESS, PERFORMANCE PROCESS) 뺐었다 —
 * 오른쪽 개념도가 이미 그 상품이 무엇을 묶는지 보여 주는데, 그 아래 다시
 * 단계별 타임라인이 오면 같은 말을 두 번 한다는 이유였다. 퍼포먼스는
 * 다시 붙였다 — "가설 → A/B 테스트 → 데이터 분석 → 리마케팅"이 반복되며
 * 성과를 끌어올린다는 이야기는 개념도(무엇을 묶는지)가 못 하는 말이라,
 * 겹치지 않는다. IMC는 겹쳐서(imcProcess) 그대로 뺀 채로 둔다 — 다시
 * 붙일 일이 생기면 그대로 쓰면 된다.
 */
export default function ServiceDetail({
  service,
}: {
  service: (typeof services)[number];
}) {
  const diagram = diagrams[service.slug];

  /* 글로벌은 대제목 블록(영문 라벨 · 대제목 · 설명 · 키워드 알약 · 문의하기 ·
     오른쪽 지구본 개념도) 없이 두 상품 탭으로 바로 시작한다. 그 블록이
     말하던 "왜 지금 해외인가"는 아래 두 상품 지면이 각자 다시 풀고 있어서,
     위에 한 겹 더 얹으면 같은 얘기를 두 번 하는 자리가 됐다.
     (id는 그대로 둔다 — 상품 메뉴가 이 앵커로 자리를 잡는다.) */
  if (service.slug === "global") {
    return (
      <section id={service.slug} className="scroll-mt-32">
        <GlobalMarketingTabs />
      </section>
    );
  }

  return (
    <ServiceSection
      service={service}
      /* 한 페이지 안에 순서 있는 묶음이 여럿인 상품에만 번호를 붙인다 —
         지금은 바이럴뿐이다(블루에그 01 → 바이럴 마케팅 02 → 리워드 03). */
      no={service.slug === "viral" ? "01" : undefined}
      asideBleed={diagram?.bleedRight}
      aside={
        diagram ? (
          /* 폭 제한을 바깥 상자로 옮긴다. 아래 음수 여백을 %로 주는데,
             margin 의 % 는 "담고 있는 상자"의 폭을 기준으로 계산된다 —
             상자가 그림보다 넓으면 끌어올리는 양이 어긋난다.
             흘려보내는 그림은 상한 없이 칸을 꽉 채운다. */
          <div
            /* 좁은 화면에서는 폭을 한 번 더 물린다. 다섯 장 모두 세로로 긴
               그림(비율 0.60~0.75)이라, 칸 폭을 그대로 채우면 390px 화면에서
               세로가 500px 가까이 자라 그림 한 장이 화면을 통째로 먹는다.
               260px면 세로가 350px 안쪽으로 들어온다. 화면이 넓어지는 만큼
               한 단씩 풀어 준다 — lg(1024px)까지 오면 한 칸이 900px가 넘어서
               340px짜리 그림은 가운데 덩그러니 떠 보인다.

               폭 상한을 인라인 style 이 아니라 CSS 변수로 넘기는 이유는,
               인라인 style 이 유틸리티 클래스를 이겨서 좁은 화면 상한을
               덮어쓰기 때문이다. */
            className={
              /* 쌓이는 구간(md 미만)에서는 제목 위에 가운데로 놓고 폭 상한을
                 아예 두지 않는다 — 한 단을 혼자 쓰는 자리라 칸을 꽉 채우는
                 게 맞다. 상한을 두면 그만큼이 좌우 빈 여백으로 남아 그림이
                 덩그러니 떠 보인다. md 부터는 오른쪽 칸 크기에 맞춰 줄어든다. */
              diagram.bleedRight
                ? "mx-auto w-full md:max-w-[460px] lg:max-w-[620px] xl:max-w-none"
                : "mx-auto w-full md:max-w-[340px] lg:max-w-[420px] xl:max-w-(--diagram-max)"
            }
            style={
              diagram.bleedRight
                ? undefined
                : ({
                    "--diagram-max": `${diagram.maxWidth ?? 540}px`,
                  } as React.CSSProperties)
            }
          >
            <Image
              src={diagram.src}
              alt={diagram.alt}
              width={diagram.width}
              height={diagram.height}
              sizes={
                diagram.bleedRight
                  ? "(min-width: 1280px) 55vw, (min-width: 768px) 45vw, 100vw"
                  : "(min-width: 1280px) 34rem, (min-width: 768px) 40vw, 100vw"
              }
              style={{
                marginTop: `-${(((diagram.inkTop ?? 0) / diagram.width) * 100).toFixed(2)}%`,
              }}
              className="h-auto w-full"
            />
          </div>
        ) : undefined
      }
    >
      {/* 왜 다이버즈인지 — WHY DIVERZ 벤토 그리드. */}
      {service.slug === "imc" && <ImcWhyDiverz />}

      {/* 가설 → A/B 테스트 → 데이터 분석 → 리마케팅, 지속적인 분석으로
          성과를 끌어올린다는 이야기. */}
      {service.slug === "performance" && <PerformanceFunnel />}

      {/* 바이럴 채널 3종 + 상위노출 2종. */}
      {service.slug === "viral" && <ViralChannels />}
    </ServiceSection>
  );
}
