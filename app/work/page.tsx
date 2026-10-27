import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import GradientLine from "@/components/gradient-line";
import PageHero from "@/components/page-hero";
import WorkProjects from "@/components/work-projects";

export const metadata: Metadata = pageMetadata({
  path: "/work",
  title: "WORK",
  description:
    "다이버즈가 함께한 브랜드와 프로젝트 기록입니다.",
});

/**
 * WORK — 배너 아래로 곧장 갈래 탭과 격자가 오는 단순한 페이지.
 *
 * 한때 여기 누적 성과 두 줄(프로젝트/클라이언트 수치)이 있었다. 걷어냈다 —
 * 홈(WHY DIVERZ)에서 이미 같은 수치를 말한다. 클라이언트 로고 격자도 지면
 * 맨 아래에서 한 번 걷어냈는데, 지금은 마케팅 갈래 안으로 들어가 있다
 * (components/work-projects.tsx).
 */
export default function WorkPage() {
  return (
    <>
      {/* who-we-are·service와 같은 히어로 — 다크 배경 + GradientLine 제목.
          설명글은 두지 않는다. 무엇을 해 왔는지는 바로 아래 컷 격자가
          말하고 있어서, 그 위에 세 줄로 다시 적으면 같은 말을 두 번 한다.
          제목 위 WORK 는 eyebrow(12px 라벨)가 아니라 lead 로 넣는다 —
          서비스 지면의 상품명("IMC Marketing")과 같은 자리·같은 크기·같은
          키컬러다. lead 를 넘기면 배너 위아래 여백도 그 규격을 따라가므로
          compact 는 함께 뺐다(어차피 lead 가 있으면 무시된다). */}
      <PageHero
        lead="WORK"
        title={<GradientLine>다이버즈와 함께한 프로젝트</GradientLine>}
        center
        borderless
        titleReveal
        noBackdrop
      />

      {/* 포트폴리오 — 갈래 탭 하나에 격자 하나(components/work-projects.tsx).
          영상 제작은 화면 끝까지 물린 컷 격자이고, 아무 타일이나 누르면 그
          편의 컷 전체가 모달에 세로로 이어 뜬다. 마케팅은 함께한 브랜드
          로고 격자다. 탭으로 갈라 두면 두 격자가 한 화면에 겹쳐 서지 않는다. */}
      <WorkProjects />
    </>
  );
}
