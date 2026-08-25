"use client";

import { useState } from "react";

import EcommerceMarketing from "@/components/ecommerce-marketing";
import HospitalMarketing from "@/components/hospital-marketing";
import { ChipTabs, type ChipTab } from "@/components/ui/animated-chip-tab-component";

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
  { id: "ecommerce", label: "중국 이커머스 입점 마케팅" },
  { id: "hospital", label: "중국인 유입 병원 마케팅" },
];

export default function GlobalMarketingTabs() {
  const [active, setActive] = useState(tabs[0].id);

  return (
    <div className="mt-20 sm:mt-24">
      <ChipTabs
        tabs={tabs}
        selected={active}
        onSelect={setActive}
        layoutId="global-marketing-tab-pill"
      />

      <div className="mt-12 sm:mt-14">
        {active === "ecommerce" ? <EcommerceMarketing /> : <HospitalMarketing />}
      </div>
    </div>
  );
}
