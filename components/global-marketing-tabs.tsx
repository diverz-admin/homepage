"use client";

import { useState } from "react";

import EcommerceMarketing from "@/components/ecommerce-marketing";
import HospitalMarketing from "@/components/hospital-marketing";
import {
  ChipTabs,
  type ChipTab,
} from "@/components/ui/animated-chip-tab-component";
import WorkLink from "@/components/work-link";

/**
 * 글로벌 마케팅 대제목 아래로 매달리는 두 상품을 탭으로 오간다.
 *
 *   중국 이커머스 입점 마케팅 · 중국인 유입 병원 마케팅
 *
 * 예전에는 병원 마케팅 하나뿐이라 번호(01)를 매겨 그대로 이어 붙였다.
 * 상품이 둘로 늘면서 그 둘은 순서 있는 흐름이 아니라 나란한 선택지가 됐다 —
 * 그래서 번호 대신 탭으로 가르고, 각 상품 컴포넌트(hospital-marketing·
 * ecommerce-marketing)에서는 SectionNumber를 뺐다.
 */
const tabs: ChipTab[] = [
  { id: "ecommerce", label: "중국 이커머스 입점/마케팅" },
  { id: "hospital", label: "중국인 유입 병원 마케팅" },
];

export default function GlobalMarketingTabs() {
  const [active, setActive] = useState(tabs[0].id);

  return (
    // 좌우 여백은 여기서 따로 손대지 않는다 — 서비스 상세 지면 전체가
    // .service-page 로 이미 좁은 여백을 쓴다(app/globals.css). 예전에는 이
    // 블록만 음수 마진으로 넓혀 뒀는데, 지면 전체가 좁아진 뒤로는 둘이
    // 겹쳐 여백이 과하게 줄어든다.
    //
    // 위 여백(.section-gap)도 없다. 예전에는 이 블록 위에 글로벌 대제목
    // 블록이 있어서 둘 사이를 벌려야 했는데, 그 블록이 빠지면서 이 탭이
    // 지면의 첫 덩어리가 됐다 — 여기서 또 벌리면 상품 메뉴 띠와의 사이가
    // 두 번 벌어진다(지면 위 여백은 app/service/[slug]/page.tsx 가 준다).
    <div>
      {/* 탭을 왼쪽으로 붙이고, 남는 폭은 헤어라인으로 마저 긋는다.
          SectionNumber("01 ─────")와 같은 문법이다 — 선은 칸을 나누는
          테두리가 아니라 "여기서부터 새 묶음"이라는 표시라 오른쪽으로
          갈수록 흐려져 사라진다. 가운데 정렬이던 탭 묶음이 지면 왼쪽
          기준선(아래 제목·본문)과 같은 축에 서면서, 동시에 위 블록과의
          경계가 눈에 잡힌다.

          ChipTabs는 mx-auto·p-1.5를 기본값으로 들고 있다. mx-0으로 가운데
          정렬을 풀고 px-0으로 왼쪽 안쪽 여백까지 걷어야 알약이 기준선에
          딱 맞는다(세로 여백 py-1.5는 그대로 둔다).

          좁은 화면에서는 탭이 두 줄로 접히면서 선이 실오라기만 남으므로
          아예 감춘다. */}
      <div className="flex items-center gap-6">
        <ChipTabs
          tabs={tabs}
          selected={active}
          onSelect={setActive}
          layoutId="global-marketing-tab-pill"
          className="mx-0 px-0"
        />
        {/* 헤어라인은 알약과 WORK 버튼 사이를 잇는다 — 좁은 화면에서는
            탭이 두 줄로 접히며 실오라기만 남으므로 감춘다. */}
        <span
          aria-hidden
          className="hidden h-px flex-1 bg-gradient-to-r from-accent/35 to-transparent sm:block"
        />
        {/* 오른쪽 끝은 WORK 로 건너가는 자리 — components/work-link.tsx. */}
        <WorkLink className="ml-auto sm:ml-0" />
      </div>

      {/* 회색 박스로 한 번 더 감싸지 않는다 — HospitalMarketing은 그
          자체로 이 페이지의 다른 상품(ServiceSection)과 같은 결의 온전한
          본문(어두운 "유입 시스템" 카드, 패키지 카드 등을 이미 갖췄다)이라,
          박스에 담으면 페이지 속 페이지처럼 보인다. 탭 아래 흰 지면에
          그대로 얹어야 "박스가 아니라 페이지 전체가 이어진다"는 인상이
          난다. */}
      <div className="mt-14 sm:mt-16">
        {active === "ecommerce" ? (
          <EcommerceMarketing />
        ) : (
          <HospitalMarketing />
        )}
      </div>
    </div>
  );
}
