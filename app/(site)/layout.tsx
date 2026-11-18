import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

/**
 * 사이트 본 지면(메뉴에 걸린 페이지들)의 틀 — 헤더 · 본문 · 푸터.
 *
 * 예전에는 루트 레이아웃이 이 셋을 직접 붙였는데, 헤더/푸터 없이 서야 하는
 * 광고 랜딩(app/(landing))이 생기면서 이 묶음으로 내렸다. 라우트 그룹이라
 * 주소에는 (site)가 붙지 않는다.
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
