import type { Metadata } from "next";
import GradientLine from "@/components/gradient-line";
import PageHero from "@/components/page-hero";
import WorkProjects from "@/components/work-projects";

export const metadata: Metadata = {
  title: "WORK",
  description: "다이버즈가 함께한 브랜드와 프로젝트 기록입니다.",
};

/**
 * WORK — 배너 아래로 곧장 작업물 격자가 오는 단순한 페이지.
 *
 * 한때 여기 두 가지가 더 있었다 — 누적 성과 두 줄(프로젝트/클라이언트 수치)과
 * 클라이언트 로고 격자. 둘 다 걷어냈다. 수치는 홈(WHY DIVERZ)에서 이미 말하고,
 * 로고는 홈의 3줄 마퀴(components/client-logos.tsx)에서 흐른다. 이 지면은
 * 작업물만 보여 준다.
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

      {/* 포트폴리오 — 화면 끝까지 물린 컷 격자. 아무 타일이나 누르면 그
          편의 컷 전체가 모달에 세로로 이어 뜬다(components/work-projects.tsx).
          "그래서 무엇을 만들었는가"를 실물로 보여 주는 자리다. 아래에 있던
          클라이언트 로고 격자는 걷어냈다 — 흰 타일 46장이 이 컷들 바로 밑에
          붙으니 지면이 두 벌의 격자로 갈라졌다. */}
      <WorkProjects />
    </>
  );
}
