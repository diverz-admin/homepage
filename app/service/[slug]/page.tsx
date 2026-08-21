import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import GradientLine from "@/components/gradient-line";
import PageHero from "@/components/page-hero";
import KeepSectionInView from "@/components/keep-section-in-view";
import ServiceDetail from "@/components/service-detail";
import { MenuVertical } from "@/components/ui/menu-vertical";
import { services } from "@/lib/site";

/**
 * 히어로 상단에서 돌아가는 서비스명(영문).
 * lib/site.ts의 services에서 파생하지 않는다 — 표기가 국문이라 그대로 못 쓴다.
 */
const heroServices = [
  "IMC Marketing",
  "Contents",
  "Viral",
  "Performance Marketing",
  "Global Marketing",
] as const;

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
 * 왼쪽은 5종 메뉴(components/ui/menu-vertical.tsx), 오른쪽이 내용이다.
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
        typed={{ texts: heroServices }}
      />

      {/* overflow-x-clip — 블루에그 그래픽이 컨테이너 밖으로 흘러 화면 끝에
          닿는데(.xl:bleed-right), 그대로 두면 가로 스크롤이 생긴다.
          hidden 이 아니라 clip 이다 — hidden 은 스크롤 컨테이너를 만들어
          왼쪽 메뉴의 sticky 를 죽인다. */}
      <div className="on-light overflow-x-clip bg-white">
        {/* 배너와 본문 사이 숨. 헤더 높이만큼 내리는 값은 배너가 이미
            갖고 있으므로, 여기 여백은 순수하게 두 덩어리 사이 간격이다. */}
        {/* 위 여백은 xl 부터만 크게 잡는다. 거기서는 왼쪽 세로 메뉴와 오른쪽
              제목이 같은 선에서 시작해야 해서 배너와의 간격이 그만큼 필요하다.
              그 아래에서는 메뉴가 가로 한 줄로 눕고 제목이 그 아래로 내려오므로
              맞출 선이 없다 — 배너 바로 밑에 붙이는 편이 낫다. */}
        {/* 메뉴가 세로 칸으로 서는 지점은 xl(1280px)이다. 한동안 lg였는데,
            1024~1279px 구간에서 메뉴(≈353px)와 좌우 여백이 먼저 빠지면 본문에
            380px 남짓밖에 안 남아 오른쪽 개념도를 세울 자리가 없었다. 메뉴를
            가로 한 줄로 눕히면 그 폭이 통째로 본문 몫이 되고, 개념도가 제목
            오른쪽에 붙는다(components/service-section.tsx의 md 2단). */}
        <div className="page-container pt-14 pb-28 sm:pt-20 sm:pb-36 xl:pt-40">
          <div className="grid gap-16 xl:grid-cols-[auto_minmax(0,1fr)] xl:gap-24">
            {/* 왼쪽 메뉴. 오른쪽 내용이 길어도 화면에 남는다. */}
            {/* min-w-0 — 안에 든 가로 스크롤 메뉴의 "내용 전체 폭"(2,768px)이
                그리드 칸의 최소 폭으로 잡히면서, 이 칸이 화면보다 7배 넓어지고
                오른쪽 본문까지 통째로 화면 밖으로 밀려 잘렸다. 스크롤 되는
                요소를 그리드/플렉스 칸에 넣을 때는 칸의 최소 폭을 0으로
                풀어 줘야 한다. */}
            <div className="min-w-0 xl:sticky xl:top-28 xl:self-start">
              <div>
                {/* color 는 .on-light 전용 포인트 컬러(#4c8dd3)를 그대로 넣는다.
                  motion 이 색을 보간해야 해서 CSS 변수는 쓸 수 없다.
                  activeHref 로 지금 보고 있는 상품을 켜 둔다. */}
                <MenuVertical
                  color="#4c8dd3"
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
            <div className="min-w-0">
              {/* 예전에는 여기에 왼쪽 "SERVICE" 라벨만큼의 빈 자리를 두어
                  제목 높이를 맞췄다. 라벨이 없어졌으니 두 단이 같은 선에서
                  시작해서, 그 자리도 함께 뺐다. */}
              {/* 상품을 갈아탈 때 보던 자리를 지켜 준다 — 컴포넌트 주석 참고. */}
              <KeepSectionInView id={service.slug} />

              <ServiceDetail service={service} />

              {/* 다음 상품으로 넘어가는 줄. 메뉴는 왼쪽에 늘 떠 있지만,
                본문 끝에서 손이 가는 자리는 여기다. */}
              <div className="mt-24 border-t border-line pt-8">
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
      </div>
    </>
  );
}
