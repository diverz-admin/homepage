"use client";

import { useState } from "react";

import ContentsProduction from "@/components/contents-production";
import WorkLink from "@/components/work-link";
import {
  ChipTabs,
  type ChipTab,
} from "@/components/ui/animated-chip-tab-component";

/**
 * 콘텐츠 상품 본문 아래로 매달리는 갈래를 탭으로 오간다.
 *
 * 지금은 영상 하나뿐이다. 그래도 탭으로 세우는 건 이 자리가 갈래를 담는
 * 자리라는 걸 미리 보여 주기 때문이다 — 상세페이지 / 디자인처럼 다른
 * 갈래가 들어올 때 판형을 다시 짜지 않고 tabs 배열과 패널만 늘리면 된다.
 *
 * 판형은 글로벌 마케팅(components/global-marketing-tabs.tsx) · 바이럴
 * (components/viral-program-tabs.tsx)과 같다 — 세 지면이 같은 자리에서
 * 같은 문법으로 갈래를 가른다.
 */
const tabs: ChipTab[] = [{ id: "video", label: "영상 제작" }];

export default function ContentsTabs() {
  const [active, setActive] = useState(tabs[0].id);

  return (
    /* 위 여백(.section-gap)은 없다. 예전에는 이 탭 위에 콘텐츠 대제목
       블록이 있어서 둘 사이를 벌려야 했는데, 그 블록이 빠지면서 이 탭이
       지면의 첫 덩어리가 됐다 — 여기서 또 벌리면 상품 메뉴 띠와의 사이가
       두 번 벌어진다. 글로벌 탭과 같다(components/global-marketing-tabs.tsx). */
    <div>
      {/* 탭을 왼쪽으로 붙이고, 남는 폭은 헤어라인으로 마저 긋는다.
          선은 칸을 나누는 테두리가 아니라 "여기서부터 새 묶음"이라는 표시라
          오른쪽으로 갈수록 흐려져 사라진다.

          ChipTabs는 mx-auto·p-1.5를 기본값으로 들고 있다. mx-0으로 가운데
          정렬을 풀고 px-0으로 왼쪽 안쪽 여백까지 걷어야 알약이 기준선에
          딱 맞는다(세로 여백 py-1.5는 그대로 둔다).

          layoutId 는 다른 지면의 탭과 다르게 준다 — 같은 값이면 두 컴포넌트가
          한 화면에 설 때 알약을 서로 주고받는다.

          좁은 화면에서는 탭이 두 줄로 접히면서 선이 실오라기만 남으므로
          아예 감춘다. */}
      <div className="flex items-center gap-6">
        <ChipTabs
          tabs={tabs}
          selected={active}
          onSelect={setActive}
          layoutId="contents-tab-pill"
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

      {/* 회색 박스로 한 번 더 감싸지 않는다 — 패널이 그 자체로 이 페이지의
          다른 묶음과 같은 결의 온전한 본문이라, 박스에 담으면 페이지 속
          페이지처럼 보인다(글로벌 · 바이럴 탭과 같은 규칙). */}
      <div className="mt-14 sm:mt-16">
        {active === "video" && <ContentsProduction />}
      </div>
    </div>
  );
}
