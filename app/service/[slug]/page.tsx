import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import GradientLine from "@/components/gradient-line";
import PageHero from "@/components/page-hero";
import KeepSectionInView from "@/components/keep-section-in-view";
import ServiceDetail from "@/components/service-detail";
import { MenuHorizontal } from "@/components/ui/menu-horizontal";
import { services } from "@/lib/site";

/**
 * 히어로 상단에 고정으로 서는 서비스명(영문).
 *
 * 예전에는 다섯 이름이 타이핑 효과로 돌아갔는데, 상품마다 페이지가 갈린
 * 뒤로는 지금 보고 있는 상품이 무엇인지 흐리기만 했다 — 클릭해 들어온
 * 이름이 지워지고 다른 이름이 쳐진다. 이제는 그 자리에 이 페이지의 이름만
 * 세운다.
 *
 * lib/site.ts의 services에서 파생하지 않는다 — 표기가 국문(name)이거나
 * 전부 대문자(en)라 그대로 못 쓴다.
 */
const heroServiceNames: Record<string, string> = {
  imc: "IMC Marketing",
  performance: "Performance Marketing",
  viral: "Viral",
  global: "Global Marketing",
  contents: "Contents",
};

/**
 * 상품 한 종의 상세 페이지. 서비스 영역의 실질적인 본체다.
 *
 * 예전에는 /service 한 장에 5종을 전체 화면 패널로 이어 붙였고 이 경로는
 * 거기 앵커로 넘기는 리다이렉트였는데, 지금은 정반대다 — 상품마다 페이지가
 * 있고 /service 가 첫 상품(IMC)으로 넘긴다.
 *
 * 상단 배너(PageHero)는 원페이지 시절 /service 에 있던 것을 그대로 쓴다.
 * /service 가 이 경로로 넘어오는 이상, 배너가 여기 없으면 서비스 영역에서
 * 통째로 사라진다. 상품이 바뀌어도 배너는 같다 — 서비스 전체의 문패다.
 *
 * 5종 메뉴(components/ui/menu-horizontal.tsx)가 본문 위에 가로 한 줄로
 * 눕고, 그 아래가 내용이다. 한동안 넓은 화면에서만 메뉴를 왼쪽 세로 칸으로
 * 세웠는데, 그 폭(≈353px)이 본문에서 통째로 빠지면서 1280px 근처에서 제목이
 * 글자 단위로 깨지고 오른쪽 개념도가 설 자리를 잃었다. 위로 올리면 그 폭이
 * 전부 본문 몫이 되고, 모든 화면 폭에서 배치가 한 벌로 같아진다.
 * 배경은 전부 흰색으로 통일했다. 상품마다 배경색을 달리하던 "수심" 배열은
 * 한 화면에서 이어 보일 때 의미가 있던 것이라, 페이지가 갈린 뒤로는
 * 넘어갈 때마다 톤이 튀기만 했다.
 */
export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return { title: "SERVICE" };
  return {
    title: `${service.name} | SERVICE`,
    description: service.summary,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = services.findIndex((s) => s.slug === slug);
  if (index === -1) notFound();

  const service = services[index];
  // 목록을 한 바퀴 돌게 이어 붙인다 — 마지막 다음은 처음.
  const next = services[(index + 1) % services.length];

  return (
    <>
      <PageHero
        title={
          <>
            <GradientLine>브랜드와 고객이 만나는</GradientLine>
            <GradientLine>모든 접점을 설계합니다</GradientLine>
          </>
        }
        description={
          "브랜드가 고객에게 발견되는 순간부터 신뢰를 얻고 선택되는 과정까지,\n" +
          "각 채널의 역할을 전략적으로 설계하고 실행합니다."
        }
        lead={heroServiceNames[slug] ?? service.en}
      />

      {/* overflow-x-clip — 블루에그 그래픽이 컨테이너 밖으로 흘러 화면 끝에
          닿는데(.xl:bleed-right), 그대로 두면 가로 스크롤이 생긴다. hidden이
          아니라 clip을 쓴 건 hidden이 스크롤 컨테이너를 만들어 안쪽의
          sticky를 죽이기 때문인데, overflow-x만 visible이 아니어도(값이
          clip이어도) 같은 조상의 overflow-y가 auto로 계산돼 버려 결국
          sticky가 죽는다(글로벌 페이지의 RiseReveal이 실측으로 확인됨).
          그래서 이 클래스는 실제로 필요한 바이럴 페이지에만 건다 — 다른
          상품은 가로로 흘러나가는 그래픽이 없어 클리핑이 필요 없다. */}
      {/* service-page — 이 지면의 page-container 좌우 여백을 좁힌다
          (app/globals.css). 안쪽에 겹치는 RiseReveal 패널의 컨테이너까지
          한 번에 덮으려고 클래스를 이 바깥 상자에 건다. */}
      <div
        className={`service-page on-light bg-white ${service.slug === "viral" ? "overflow-x-clip" : ""}`}
      >
        {/* 상품 메뉴 — 배너 바로 밑에 붙인다. 예전엔 연한 하늘색(#acd4ff)
            띠였는데, 배너(PageHero)가 어두운 잠수부 사진 배경을 갖게
            되면서 밝은 띠가 그 위에 갑자기 끊겨 붙는 조각처럼 보였다.
            배너와 같은 어두운 남색(bg-abyss)으로 바꿔 자연스럽게
            이어지게 한다 — 띠가 곧 경계라 밑줄은 여전히 없다.

            색은 토큰이 아니라 값으로 적는다. 이 지면은 .on-light 안이라
            역할 토큰(--accent 등)이 흰 배경용으로 뒤집혀 있어 어두운
            바탕에 어울리는 값이 안 나온다.

            한때 sticky로 헤더 밑에 붙여 봤는데, 글로벌 페이지의 RiseReveal
            (지구본이 붙어 있다가 아래 패널에 덮이는 연출)과 같이 스크롤하면
            띠가 그 사이에 어중간하게 끼어 보여 도로 걷었다. */}
        <div className="bg-abyss">
          {/* min-w-0 — 안에 든 가로 스크롤 메뉴의 "내용 전체 폭"이 이 칸의
              최소 폭으로 잡히면 지면이 화면보다 넓어진다. 스크롤 되는 요소를
              감쌀 때는 최소 폭을 0으로 풀어 준다. */}
          <div className="page-container min-w-0 py-5 xl:py-7">
            {/* 어두운 띠 위라 글자도 밝은 색으로 뒤집는다 — 지금 보고
                있는 상품은 예전 띠 배경색(#acd4ff)을 그대로 물려받아
                밝게 켜지고, 나머지는 흰색을 옅게 깔아 둔다. */}
            <MenuHorizontal
              color="#acd4ff"
              baseColor="rgb(255 255 255 / 0.55)"
              skew={-4}
              activeHref={`/service/${service.slug}`}
              /* 스크롤 위치를 그대로 둔다 — 상품을 바꿔도 보고 있던
                 자리에서 내용만 갈린다(맨 위 배너로 튀지 않는다). */
              scroll={false}
              menuItems={services.map((s) => ({
                label: s.name,
                href: `/service/${s.slug}`,
              }))}
            />
          </div>
        </div>

        {/* 여기도 min-w-0 — 바이럴 페이지의 순위 보드가 가로로 흐르는
            마퀴라, 그 내용 폭(2,768px)이 이 칸의 최소 폭으로 잡힌다. */}
        {/* 위 여백은 색 띠와 본문 사이 숨이다. 띠가 화면 폭을 다 쓰는 덩어리라
            56/80px 로는 본문이 띠에 붙어 읽혔다 — 80/112/144px 로 벌린다. */}
        <div className="page-container pt-20 pb-28 sm:pt-28 sm:pb-36 xl:pt-36">
          <div className="min-w-0">
            {/* 상품을 갈아탈 때 보던 자리를 지켜 준다 — 컴포넌트 주석 참고. */}
            <KeepSectionInView id={service.slug} />

            <ServiceDetail service={service} />

            {/* 다음 상품으로 넘어가는 줄. 메뉴는 본문 위에 있지만, 다 읽고
                난 뒤 손이 가는 자리는 여기다. */}
            <div className="section-gap border-t border-line pt-8">
              <Link
                href={`/service/${next.slug}`}
                className="group flex items-baseline justify-between gap-6"
              >
                <span className="font-display text-xs font-bold tracking-[0.3em] text-accent">
                  NEXT
                </span>
                <span className="flex items-baseline gap-3 font-display text-fluid-lg font-bold tracking-tight text-foreground transition-opacity group-hover:opacity-60">
                  {next.name}
                  <span aria-hidden className="text-accent">
                    →
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
