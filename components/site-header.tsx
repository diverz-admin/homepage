import KineticNav from "@/components/ui/kinetic-nav";
import { company, nav } from "@/lib/site";

/**
 * 사이트 헤더. 레이아웃·모션은 KineticNav가 갖고, 여기서는 어떤 데이터를
 * 넣을지만 정한다.
 *
 * 바 오른쪽은 레퍼런스를 따라 CONTACT 링크 하나로 비웠고, 기존의 "문의하기"
 * 버튼은 메뉴 안 큰 CTA로 옮겼다. 바에 CTA까지 두면 3분할 균형이 깨진다.
 * 번호 매긴 메뉴 목록에는 WORK · RECRUITING 다음 항목으로 CONTACT를
 * 그대로 노출한다.
 */
export default function SiteHeader() {
  return (
    <KineticNav
      items={nav}
      logo={company.nameEn}
      contact={{ href: "/contact", label: "CONTACT" }}
      cta={{ href: "/contact", label: "문의하기" }}
      meta={[company.address, company.email]}
    />
  );
}
