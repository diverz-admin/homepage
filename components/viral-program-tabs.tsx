"use client";

import Image from "next/image";
import { useState } from "react";

import RankingBoard from "@/components/ranking-board";
import Reveal from "@/components/reveal";
import WorkLink from "@/components/work-link";
import {
  ChipTabs,
  type ChipTab,
} from "@/components/ui/animated-chip-tab-component";
import { placeRankings, smartstoreRankings, viralSolution } from "@/lib/site";

/**
 * 바이럴 상품의 세 갈래를 탭으로 오간다.
 *
 *   바이럴 마케팅 솔루션 블루에그 · 바이럴 마케팅 · 리워드 마케팅
 *
 * 예전에는 01 블루에그 → 02 바이럴 마케팅 → 03 리워드 마케팅으로 번호를
 * 매겨 세 묶음을 세로로 이어 붙였다. 그런데 셋은 순서 있는 흐름이 아니라
 * 나란한 선택지다 — 블루에그를 먼저 하고 리워드를 나중에 하는 게 아니라,
 * 브랜드 상황에 따라 고르는 갈래다. 번호를 매기면 없는 순서를 있다고
 * 말하게 되고, 지면도 아래로 세 배 길어져 리워드 실적(순위 보드)까지
 * 한참 스크롤해야 닿았다.
 *
 * 그래서 글로벌 마케팅(components/global-marketing-tabs.tsx)과 같은 판형으로
 * 맞춘다 — 탭으로 가르고, 각 본문에서는 SectionNumber를 뺐다.
 *
 * 첫 탭(블루에그)의 본문은 여기서 그리지 않고 밖에서 받는다(blueEgg prop).
 * 그 자리는 다른 상품과 똑같은 ServiceSection 이라, 여기에 다시 옮겨
 * 적으면 규격이 두 벌로 갈린다 — 서버에서 그린 것을 그대로 슬롯에 꽂는다
 * (components/service-detail.tsx).
 *
 * 내용은 기존 사이트 diverz.kr/viralmarketing, diverz.kr/35 에서 옮겨 왔다.
 *
 * 색은 절대 팔레트(text-abyss 등)가 아니라 역할 토큰(text-foreground 등)을
 * 쓴다 — 패널 톤에 따라 같이 뒤집혀야 한다.
 */

const { viral, reward } = viralSolution.programs;

const tabs: ChipTab[] = [
  { id: "blueegg", label: viralSolution.name },
  { id: "viral", label: viral.name },
  { id: "reward", label: reward.name },
];

/* 두 프로그램이 공유하는 규격. 제목 크기는 블루에그 탭(ServiceSection의 h2)과
   같은 text-fluid-2xl 로 맞춘다 — 한 지면에서 셋의 무게가 다르면 프로그램
   쪽이 곁다리로 읽힌다. 공감 한 줄과 알약 규격도 마찬가지로 셋이 같다. */
const programHook =
  "text-fluid-lg font-bold tracking-[-0.02em] break-keep text-accent";
const programTitle =
  "mt-3 font-display text-fluid-2xl font-bold tracking-tight break-keep text-foreground";
const programSummary =
  "mt-6 max-w-2xl text-fluid-lg leading-[1.85] font-normal tracking-[-0.04em] break-keep text-foreground/85";
const pill =
  "rounded-full bg-abyss px-5 py-2.5 text-[0.95rem] font-medium break-keep text-white transition-colors hover:bg-mid";

/** 바이럴 마케팅 — 제목 → 설명 → 키워드, 오른쪽에 네이버 앱 목업. */
function ViralMarketing() {
  return (
    /* 왼쪽 본문 · 오른쪽 목업. md 미만에서는 한 단으로 쌓이고 목업이
       본문 '위'로 올라간다 — 좁은 화면에서 옆에 세우면 둘 다 눌린다.

       세로는 위에 붙인다(items-start). 예전에는 가운데 정렬이었는데, 그때는
       이 묶음 머리에 번호 줄("02 ────")이 있어 제목 위 빈자리를 채워 줬다.
       탭으로 바뀌면서 그 줄이 사라지자, 세로로 긴 목업(563px)에 끌려 제목이
       230px 아래에서 시작했다 — 탭 바로 밑이 통째로 비어 보인다. 위에 붙이면
       제목의 윗선이 목업의 윗선과 만나 두 단이 한 줄에서 출발한다
       (ServiceSection의 그래픽 칸과 같은 규칙). 남는 높이는 아래로 가지만,
       거기는 묶음의 끝이라 다음 것과 부딪히지 않는다. */
    <div className="grid gap-12 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:items-start md:gap-10 lg:gap-16">
      <div>
        {/* 제목 위 공감 한 줄. 상품 이름표(영문 라벨)는 두지 않는다 — 바로
            위 탭에 이미 같은 이름이 떠 있어서, 그 아래 한 번 더 적으면 같은
            말을 두 번 한다. 그 자리를 읽는 사람의 마음을 먼저 받는 문장에
            내주는 것도 글로벌 마케팅의 두 탭과 같은 규칙이다. */}
        <Reveal delay={40}>
          <p className={programHook}>{viral.hook}</p>
        </Reveal>

        <Reveal delay={60}>
          <h4 className={programTitle}>{viral.title ?? viral.name}</h4>
        </Reveal>

        <Reveal delay={80}>
          <p className={programSummary}>{viral.summary}</p>
        </Reveal>

        <Reveal delay={120}>
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {viral.points.map((point) => (
              <li key={point} className={pill}>
                {point}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      {/* 네이버 앱 목업 — 이 프로그램이 말하는 "네이버 플레이스/쇼핑에서의
          노출"이 실제로 어디서 일어나는지 보여 준다.
          배경이 흰색으로 구워진 그림이라 지면(흰 배경)에 그대로 얹는다.
          priority 를 주지 않는다 — 페이지 한참 아래라 첫 화면에 없다.

          order-first — 한 단으로 쌓이는 좁은 화면에서는 목업이 제목 '위'로
          올라간다. 본문 뒤로 보내면 제목·설명·알약을 다 지나서야 나와서,
          그림이 무엇에 대한 그림인지 놓친다(ServiceSection 의 그래픽 칸과
          같은 규칙). md 부터는 2단이라 순서를 되돌린다. */}
      <Reveal delay={140} className="reveal-x order-first md:order-none">
        <Image
          src="/images/service/viral/naver-app-mockup.png"
          alt="네이버 검색 결과 화면 — 플레이스에 브랜드 정보와 리뷰가 노출되는 자리"
          width={1057}
          height={1488}
          /* 폭에 상한을 둔다. 칸(1fr)을 그대로 채우면 넓은 화면에서 630px까지
             자라 세로가 880px를 넘고, 왼쪽 본문(제목+설명+알약)이 그 옆에서
             초라해진다. 세로로 긴 그림(1:1.41)이라 폭보다 키가 먼저 부담이
             된다 — 상한이 곧 이 줄의 높이다. */
          sizes="(min-width: 768px) 400px, 100vw"
          className="mx-auto h-auto w-full max-w-[300px] md:max-w-[340px] lg:max-w-[400px]"
        />
      </Reveal>
    </div>
  );
}

/** 리워드 마케팅 — 제목 → 설명 → 키워드 → 순위 상승 실적. */
function RewardMarketing() {
  return (
    <div>
      {/* 제목 위 공감 한 줄 — 바이럴 탭과 같은 규격이다. */}
      <Reveal delay={40}>
        <p className={programHook}>{reward.hook}</p>
      </Reveal>

      <Reveal delay={60}>
        <h4 className={programTitle}>{reward.title ?? reward.name}</h4>
      </Reveal>

      <Reveal delay={80}>
        <p className={programSummary}>{reward.summary}</p>
      </Reveal>

      <Reveal delay={120}>
        <ul className="mt-8 flex flex-wrap gap-2.5">
          {reward.points.map((point) => (
            <li key={point} className={pill}>
              {point}
            </li>
          ))}
        </ul>
      </Reveal>

      {/* 순위 상승 실적은 이 프로그램의 맨 아래에 둔다 — 리워드로 무엇이
          달라졌는지를 숫자로 닫는 자리라, 설명보다 뒤에 와야 근거로 읽힌다. */}
      {/* 플레이스가 위, 쇼핑이 아래. 플레이스 실적은 수치가 들어오면
          lib/site.ts 의 placeRankings 만 채우면 이 자리에 붙는다. */}
      {placeRankings.length > 0 && (
        <RankingBoard
          label="NAVER PLACE RANKING"
          channel="네이버 플레이스"
          items={placeRankings}
        />
      )}

      {/* 아래 줄은 반대 방향으로 흘린다 — 같은 방향으로 둘이 나란히 흐르면
          화면이 통째로 미끄러지는 것처럼 보인다. */}
      <RankingBoard
        label="SMARTSTORE RANKING"
        channel="네이버 쇼핑"
        items={smartstoreRankings}
        reverse
        duration={52}
      />
    </div>
  );
}

export default function ViralProgramTabs({
  blueEgg,
}: {
  /** 첫 탭의 본문 — 밖에서 그려 넣는 ServiceSection(블루에그). */
  blueEgg: React.ReactNode;
}) {
  const [active, setActive] = useState(tabs[0].id);

  return (
    /* 위 여백(.section-gap)은 없다 — 이 탭이 지면의 첫 덩어리라, 여기서 또
       벌리면 상품 메뉴 띠와의 사이가 두 번 벌어진다(지면 위 여백은
       app/service/[slug]/page.tsx 가 준다). 글로벌 탭과 같은 규칙이다. */
    <div>
      {/* 탭을 왼쪽으로 붙이고, 남는 폭은 헤어라인으로 마저 긋는다.
          SectionNumber("01 ─────")와 같은 문법이다 — 선은 칸을 나누는
          테두리가 아니라 "여기서부터 새 묶음"이라는 표시라 오른쪽으로
          갈수록 흐려져 사라진다.

          ChipTabs는 mx-auto·p-1.5를 기본값으로 들고 있다. mx-0으로 가운데
          정렬을 풀고 px-0으로 왼쪽 안쪽 여백까지 걷어야 알약이 기준선에
          딱 맞는다(세로 여백 py-1.5는 그대로 둔다).

          layoutId 는 글로벌 쪽과 다르게 준다 — 같은 값이면 두 컴포넌트가
          한 화면에 설 때 알약을 서로 주고받는다.

          좁은 화면에서는 탭이 두 줄로 접히면서 선이 실오라기만 남으므로
          아예 감춘다. */}
      <div className="flex items-center gap-6">
        <ChipTabs
          tabs={tabs}
          selected={active}
          onSelect={setActive}
          layoutId="viral-program-tab-pill"
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

      {/* 회색 박스로 한 번 더 감싸지 않는다 — 셋 다 그 자체로 이 페이지의
          다른 상품과 같은 결의 온전한 본문이라, 박스에 담으면 페이지 속
          페이지처럼 보인다(글로벌 탭과 같은 규칙). */}
      <div className="mt-14 sm:mt-16">
        {active === "blueegg" && blueEgg}
        {active === "viral" && <ViralMarketing />}
        {active === "reward" && <RewardMarketing />}
      </div>
    </div>
  );
}
