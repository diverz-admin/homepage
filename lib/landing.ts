import { smartstoreRankings, stats } from "@/lib/site";

/**
 * 광고 랜딩 문구 — app/(landing) 아래 지면들이 쓴다.
 *
 * 랜딩은 메뉴에 걸지 않고 검색에도 잡히지 않게 둔 페이지라(광고로만
 * 들어온다), 사이트 본 내용(lib/site.ts)과 섞이지 않게 따로 둔다.
 * 실적 숫자는 새로 만들지 않고 lib/site.ts 의 것을 그대로 가져다 쓴다 —
 * 같은 실적이 두 곳에 따로 적혀 있으면 한쪽만 고쳐질 자리가 된다.
 */

/** 키워드로 순위 실적 한 줄을 찾는다. 없는 키워드면 빌드에서 바로 터진다. */
function ranking(keyword: (typeof smartstoreRankings)[number]["keyword"]) {
  const found = smartstoreRankings.find((r) => r.keyword === keyword);
  if (!found) throw new Error(`smartstoreRankings 에 ${keyword} 가 없습니다.`);
  return found;
}

const renewal = stats.find((s) => s.label === "재계약률");

export type LandingCase = {
  keyword: string;
  from: number;
  to: number;
  /**
   * 문제점/솔루션 설명. 실제 진행 기록이 있는 사례만 채운다 —
   * 비워 두면 카드에 순위 변화만 나간다. 지어낸 설명은 넣지 않는다.
   */
  problem?: string;
  solution?: string;
};

export type LandingReview = {
  /** 예: "애견용품 브랜드 대표" — 실명/상호는 동의받은 경우만 */
  author: string;
  body: string;
};

/**
 * 네이버 쇼핑(스마트스토어) 상위노출 랜딩 — /lp/9q7v0hft4z (비밀 주소)
 *
 * 메타 광고로 들어온 온라인 판매자가 대상이다. 섹션 순서와 흐름은 받은
 * 레퍼런스 랜딩을 따른다:
 *   히어로 → 고객사 대화 → 후기/재계약률 → 카테고리별 사례 → 안전성 → 1페이지의 의미 →
 *   검색광고의 한계 → 광고 vs 자연 노출 비교 → 업계의 과장 → 플랫폼 로직 →
 *   솔루션 4단계 → 전담팀 → 리스크와 파트너 선택 → 신청
 *
 * 문구는 레퍼런스를 옮기지 않고 다이버즈 기준으로 새로 썼다. 레퍼런스에
 * 있던 그 회사의 수치(재계약률, 설문, 클릭률)와 사례는 다이버즈의 것이
 * 아니라 싣지 않는다. 숫자는 다이버즈 실적(lib/site.ts)만 쓴다.
 */
export const rankingLanding = {
  path: "/lp/9q7v0hft4z",
  /** 문의 메일/DB 에 남는 문의유형. 홈페이지 문의 폼의 유형과 구분된다. */
  inquiryType: "스마트스토어 상위노출 (광고 랜딩)",

  /** 무료 진단 신청 폼 선택지 (components/landing/landing-form.tsx). */
  form: {
    platforms: ["쿠팡", "네이버쇼핑", "스마트플레이스"],
    adExperience: ["있어요", "없어요"],
    budgets: ["0 ~ 100만원", "100 ~ 500만원", "500만원 이상", "상담 후 결정"],
  },

  /** 상단 띠의 앵커 메뉴. id 는 page.tsx 의 섹션 id 와 맞춘다. */
  nav: [
    { href: "#results", label: "순위 성과" },
    { href: "#talk", label: "고객 반응" },
    { href: "#reality", label: "업계의 현실" },
    { href: "#solution", label: "프로세스" },
    { href: "#apply", label: "문의하기" },
  ],

  /**
   * 히어로 — 가운데 정렬 후킹. 블루에그 플랫폼 페이지(blueeggbiz.com)의
   * 첫 화면 문구에서 출발해, 노출 → 주문 → 매출로 이어지게 다듬었다(같은 회사 상품이다).
   *
   * kicker 는 [문구, 모션] 조각으로 나눈다. 모션이 있는 조각만 밝게
   * 강조되고, 낱말 뜻대로 움직인다 — up(위로 튀어 오름) · down(작게
   * 쪼그라듦) · grow(크게 부풂). 키프레임은 globals.css "kick-" 묶음.
   * title 은 두 줄: 첫 줄 흰색, 둘째 줄 accent(사이트 강조색).
   */
  hero: {
    kicker: [
      ["순위는 ", null],
      ["높게", "up"],
      [" 광고비는 ", null],
      ["적게", "down"],
      [" 매출은 ", null],
      ["크게", "grow"],
    ] as [string, "up" | "down" | "grow" | null][],
    title: ["지금 이 순간에도", "경쟁사가 내 매출을 가져갑니다"],
    cta: "무료 상담 신청",
    // 하단 고정 바 안내 문구 (components/landing/live-stats-bar.tsx)
    barMessage: "무료 순위 진단 신청받아보세요, 매출 상승에 도움 드리겠습니다.",
    badges: ["1분 신청", "담당자 즉시 배정", "3시간 내 상담 연락"],
  },

  /**
   * 히어로 바로 다음 — 상품별 순위 추이 이미지 6장.
   *
   * 받은 시안 이미지를 그대로 쓴다(public/images/landing/ranking/,
   * 1396x1127). 넓은 화면에서는 한 줄에 3장씩 두 줄로 놓는다.
   * 이미지 안에 "중간 순위는 예시입니다"가 이미 적혀 있어서 따로 적지
   * 않는다.
   */
  rankBoard: {
    // 첫 줄은 흰색, 둘째 줄은 강조색. 미백세럼 실제 결과(78위 → 1위, 7일).
    title: ["단 7일,", "78위가 1위로"],
    body: "다이버즈와 함께 순위가 바뀐 실제 상품들입니다.",
    images: [
      {
        src: "/images/landing/ranking/car-fragrance.png",
        alt: "차량용방향제 순위 추이: 7일 동안 64위에서 2위로 상승",
      },
      {
        src: "/images/landing/ranking/sofa.png",
        alt: "쇼파 순위 추이: 7일 동안 42위에서 1위로 상승",
      },
      {
        src: "/images/landing/ranking/cleanser.png",
        alt: "청결제 순위 추이: 7일 동안 14위에서 3위로 상승",
      },
      {
        src: "/images/landing/ranking/whitening-serum.png",
        alt: "미백세럼 순위 추이: 7일 동안 78위에서 1위로 상승",
      },
      {
        src: "/images/landing/ranking/pajama.png",
        alt: "파자마 순위 추이: 7일 동안 23위에서 2위로 상승",
      },
      {
        src: "/images/landing/ranking/sleep-socks.png",
        alt: "수면양말 순위 추이: 7일 동안 34위에서 1위로 상승",
      },
    ],
  },

  /**
   * 순위 추이 바로 다음 — 순위가 오른 뒤 고객사와 나눈 대화 5장.
   * 실제 대화를 개인정보 보호를 위해 재구성한 화면이라 note 를 함께 단다.
   * 옆으로 저절로 흘러가는 띠(마퀴)로 놓는다. 이미지는 1036x1518(카톡 다크 화면).
   * 위 rankBoard 의 상품들과 같은 사례라 순서도 맞춰 둔다.
   */
  chats: {
    // 제목은 1페이지의 의미 섹션 제목과 같은 크기로 크게 쓴다.
    title: "“상위노출되니까\n확실히 매출이 올라가네요”",
    body: "순위가 오른 뒤, 대표님들이 먼저 보내온 메시지입니다.",
    note: "실제 상담 대화를 개인정보 보호를 위해 재구성한 화면입니다.",
    images: [
      {
        src: "/images/landing/chats/kakao-whitening-serum.png",
        alt: "고객사 대화: 미백세럼 78위에서 1위, 상품 사진 보완 협의",
      },
      {
        src: "/images/landing/chats/kakao-cleanser.png",
        alt: "고객사 대화: 청결제 14위에서 3위, 고객사가 감사 선물을 보냄",
      },
      {
        src: "/images/landing/chats/kakao-sleep-socks-sales.png",
        alt: "고객사 대화: 수면양말 상위 노출 이후 매출이 많이 올라 다음 달에도 계속 진행",
      },
      {
        src: "/images/landing/chats/kakao-sleep-socks.png",
        alt: "고객사 대화: 수면양말 34위에서 1위, 고객사가 커피 선물을 보내고 겨울 행사 일정 협의",
      },
      {
        src: "/images/landing/chats/kakao-sofa.png",
        alt: "고객사 대화: 쇼파 42위에서 1위, 다음 달도 그대로 진행",
      },
    ],
  },

  reviews: {
    title: "대표님들이 다시 찾는 이유",
    body: `성과 중심 운영과 꼼꼼한 관리로\n재계약률 ${renewal?.value ?? 90}% 이상을 지키고 있습니다.`,
    /**
     * 실제 고객 후기. 비어 있으면 후기 카드 줄을 그리지 않는다.
     * 동의받은 후기만 넣는다.
     */
    items: [] as LandingReview[],
  },

  cases: {
    title: "카테고리별 순위 상승 사례",
    body: "다이버즈가 실제로 진행한 키워드의 진행 전 순위와 현재 순위입니다.",
    categories: [
      {
        name: "생활/반려",
        items: [ranking("애견용품"), ranking("방향제")] as LandingCase[],
      },
      {
        name: "화장품/미용",
        items: [ranking("샴푸"), ranking("스킨케어")] as LandingCase[],
      },
      {
        name: "레저/취미",
        items: [ranking("낚시용품")] as LandingCase[],
      },
    ],
  },

  safety: {
    title: "어뷰징이 걱정되어\n망설이고 계신가요?",
    body: "숫자만 부풀리는 상위노출은 오래가지 않습니다.\n다이버즈는 유입의 질부터 관리합니다.",
    items: [
      {
        title: "보상형 광고 플랫폼 직접 운영",
        body: "여러 보상형 광고 매체를 직접 운영하고 연동해, 상품에 맞는 참여 조건으로 유입을 설계합니다.",
      },
      {
        title: "트래픽 품질 필터링",
        body: "중복 유저와 무효 클릭을 걸러내 순위에 반영될 수 있는 유입만 남깁니다.",
      },
      {
        title: "실시간 모니터링",
        body: "순위와 유입, 참여율을 대시보드로 매일 확인하고 이상 신호가 보이면 바로 조정합니다.",
      },
    ],
  },

  /**
   * 카톡 캡처 바로 다음 — 구좌별 반응 분포도(components/landing/slot-heatmap).
   * 수치 없는 개념 그림이다. 레퍼런스의 "설문 조사 자료(1,000명)" 같은
   * 출처 문구는 우리 조사가 아니라서 싣지 않는다.
   */
  /**
   * 1페이지의 의미 다음 — 광고 표시 없는 상단 노출의 신뢰. 제목만 크게
   * 두고 아래로 가는 세로선 하나로 다음 섹션에 잇는다.
   * title 은 [조각, 톤] 묶음 두 줄. 톤: dim(어둡게) · mark(흰색 + 밑줄 강조) · bright(흰색).
   */
  trust: {
    /**
     * 제목 앞에 받는 반문 — 바로 앞 섹션("소비자는 결국, 최상단만 봅니다")을
     * 본 사람이 떠올릴 법한 말을 먼저 꺼내고, bridge 로 받아서 제목으로 잇는다.
     */
    // 대화 두 줄로 보인다 — 왼쪽 고객사 말풍선, 오른쪽 다이버즈 답.
    asker: "고객사 대표님",
    objection: "최상단에는 광고가 있잖아요?",
    answerer: "다이버즈",
    bridge: "맞습니다. 그런데,",
    title: [
      [
        ["소비자는 ", "dim"],
        ["광고 표시가 없는", "mark"],
      ],
      [["상단 노출 상품을 더 신뢰합니다", "bright"]],
    ] as [string, "dim" | "mark" | "bright"][][],
    /**
     * 화살표 아래 그림(components/landing/ad-label-mockup.tsx) 문구.
     * 검색 결과 화면에서 광고 배지 자리와 광고 표시 없는 자리를 짚는다.
     */
    mockup: {
      adLabel: "광고 상품",
      cleanLabel: "광고 표시 없음",
      caption: "광고 표시 없이 이 자리에 올리는 것,\n다이버즈가 하는 일입니다",
    },
  },

  /**
   * TRUST 다음 — "유입만 늘리면 오르지 않나요?" 반문과 업계의 과장.
   * 받은 레퍼런스의 흐름(질문 → 대행사들이 하는 말 말풍선 → 현실 세 원)만
   * 빌리고 문구는 새로 썼다. 강조는 빨강 대신 accent.
   * title/결과(outcomes)는 [문구, 강조 여부] 조각.
   */
  reality: {
    title: [
      ["유입만 늘리면", false],
      ["순위는 알아서 오를까요?", true],
    ] as [string, boolean][],
    lead: "이런 연락, 한 번쯤 받아 보셨을 겁니다",
    /** 알림 카드 머리에 붙는 보낸 곳. */
    sender: "광고 대행사",
    /** \n 은 좁은 화면 카드에서만 줄바꿈된다(넓은 화면/경고 카드는 한 줄). */
    claims: [
      "클릭 수만 채우면\n1위 갑니다",
      "상위노출\n100% 보장",
      "한 달이면\n1페이지 고정",
    ],
    turn: "그런데 결과는 어땠나요?",
    /**
     * 결과 카드 셋. trend 는 카드 위 순위 그래프 모양(page.tsx RealityTrend):
     * spike(올랐다 제자리) · shaky(오르내림 반복) · drop(끝내 추락).
     */
    outcomes: [
      { lead: "며칠 반짝하고", strong: "다시 제자리로", trend: "spike" },
      { lead: "언제 걸릴지 몰라", strong: "늘 불안한 작업", trend: "shaky" },
      { lead: "끝내 남는 건", strong: "제재와 순위 하락", trend: "drop" },
    ] as { lead: string; strong: string; trend: "spike" | "shaky" | "drop" }[],
    /**
     * 세 원 아래 경고 카드. 위 claims 세 줄을 다시 꺼내 선으로 그어 지운 뒤
     * 이 문구로 맺는다. 레퍼런스("절대 믿지 마십시오" 빨간 띠)의 뜻만 받아
     * 문구를 새로 쓰고, 색은 빨강 대신 accent 로 바꿨다.
     */
    warning: {
      title: "듣기 좋은 약속일수록, 한 번 더 의심하세요",
      body: "보장 한마디에 광고비와 시간을 흘려보내는 일, 여기서 멈추셔도 됩니다.",
    },
  },

  /**
   * 경고 카드 다음 — "1등 포털이 그렇게 허술할까요?" 반문으로 플랫폼 로직의
   * 촘촘함을 보여 준다. 받은 레퍼런스(로직은 생각보다 영리하다 + 카드 셋)의
   * 구성만 빌리고 문구는 새로 썼다. icon 은 page.tsx 의 LogicIcon 이름.
   */
  platform: {
    question: ["우리나라 1등 포털 네이버가", "그렇게 허술할까요?"],
    // 둘째 조각은 강조색.
    answer: ["순위 로직은 생각보다", "훨씬 촘촘합니다"] as [string, string],
    body: "억지로 만든 유입은 걸러지고, 걸러진 만큼 순위에서 깎입니다.",
    items: [
      {
        icon: "signal",
        title: "수백 가지 신호를 읽는 랭킹",
        body: "머문 시간, 들어온 경로, 클릭의 흐름까지\n행동 하나하나를 따져 순위를 매깁니다.",
      },
      {
        icon: "shift",
        title: "예고 없이 바뀌는 기준",
        body: "로직은 공지 없이 수시로 바뀌고,\n그 주기는 생각보다 훨씬 짧습니다.",
      },
      {
        icon: "filter",
        title: "걸러내고 깎는 필터",
        body: "부자연스러운 유입은 위험 신호로 분류되어\n오히려 감점으로 돌아옵니다.",
      },
    ] as { icon: "signal" | "shift" | "filter"; title: string; body: string }[],
  },

  firstPage: {
    title: "소비자는 결국,\n최상단만 봅니다.",
    body: "1페이지에 없으면 없는 상품과 같습니다.",
    phones: ["네이버 쇼핑", "쿠팡"] as [string, string],
    high: "매우\n높음",
    low: "낮음",
    caption: "구좌별 반응 분포도",
    note: "검색 결과 위쪽일수록 클릭과 구매가 몰립니다",
  },

  problem: {
    title: "광고비는 쓰는데\n매출은 왜 그대로일까요?",
    body: "검색광고에는 구조적인 한계가 있습니다.",
    items: [
      {
        title: "입찰가 경쟁",
        body: "더 높은 단가를 써낸 판매자가 위에 노출됩니다.",
      },
      {
        title: "클릭당 과금",
        body: "구매로 이어지지 않은 클릭에도 비용이 바로 나갑니다.",
      },
      {
        title: "예산 소진",
        body: "하루 예산이 다 쓰이면 내 상품은 그 자리에서 사라집니다.",
      },
    ],
    closing: "고객은 광고 표시가 없는\n상단 상품을 더 믿습니다.",
  },

  compare: {
    title: "검색광고와 순위 최적화,\n왜 반응이 다를까요?",
    points: [
      {
        title: "광고 표시는 경계심을 만듭니다",
        body: '"광고" 표시를 보는 순간 고객은 설득당하고 있다고 느끼고 한 발 물러섭니다.',
      },
      {
        title: "일반 구좌는 검증된 상품으로 읽힙니다",
        body: "광고 표시 없이 위에 있는 상품은 많은 사람이 찾고 플랫폼이 인정한 상품으로 받아들여집니다.",
      },
    ],
    columns: [
      {
        name: "검색광고",
        rows: [
          "판매자가 보여 주고 싶은 상품",
          "설득에 대한 경계와 거리감",
          "상대적으로 낮음",
          "유입 대비 낮은 편",
        ],
      },
      {
        name: "1페이지 상위 노출",
        rows: [
          "고객이 고른 인기 상품",
          "상품과 브랜드에 대한 신뢰",
          "상위 구좌일수록 높음",
          "구매 의도가 분명한 유입",
        ],
      },
    ],
    rowLabels: ["고객 인식", "심리적 태도", "클릭률", "전환율"],
  },

  myth: {
    title: "트래픽을 넣었는데도\n순위가 그대로인가요?",
    claimsLead: "많은 곳이 이렇게 말합니다.",
    claims: [
      "무조건 순위가 오릅니다",
      "클릭만 늘리면 순위 보장",
      "넣기만 하면 끝납니다",
    ],
    realityLead: "그런데 결과는 어땠나요?",
    realities: [
      "잠깐 올랐다가 다시 떨어지는 순위",
      "언제 막힐지 모르는 매크로 트래픽",
      "결국 남는 건 제재와 순위 하락",
    ],
    closing: "광고비만 버리는 영업 멘트,\n이제 그만 속으셔도 됩니다.",
  },

  logic: {
    title: "네이버 쇼핑의 로직은\n생각보다 훨씬 똑똑합니다.",
    body: "플랫폼은 인위적인 유입을 걸러내고 순위 반영을 막기 위해 계속 바뀝니다.",
    items: [
      {
        title: "정교한 랭킹 알고리즘",
        body: "체류 시간, 유입 경로, 클릭 패턴 같은 여러 행동 데이터를 함께 봅니다.",
      },
      {
        title: "예고 없는 로직 변경",
        body: "변경은 공지 없이 이뤄지고 주기도 짧습니다.",
      },
      {
        title: "정책 필터링",
        body: "품질이 낮은 유입은 걸러지고, 심하면 상품에 불이익이 생깁니다.",
      },
    ],
  },

  /**
   * PLATFORM 다음 — 솔루션. "개발팀이 24시간 로직 변화를 지켜보고,
   * 대응 도구를 직접 만든다"는 맥락. 가운데 두 톤 제목 + 숫자 셋 + 대응
   * 사이클 카드 넷(감지 → 분석 → 개발 → 반영 → 다시 감지).
   * 받은 레퍼런스(탭 + 카드 셋)와는 구성을 일부러 다르게 했다.
   */
  solution: {
    title: ["로직이 바뀌는 그 순간에도", "다이버즈 개발팀은 깨어 있습니다"],
    body: "개발팀이 24시간 순위 로직을 지켜보고, 변화가 감지되면 대응에 필요한 도구를 직접 만들어 바로 적용합니다.",
    stats: [
      { value: "24", unit: "시간", label: "쉬지 않는 모니터링" },
      { value: "직접", unit: "", label: "개발하는 대응 솔루션" },
    ],
    cycle: [
      {
        title: "감지",
        body: "순위 로직의 작은 흔들림까지 실시간으로 잡아냅니다.",
      },
      {
        title: "분석",
        body: "무엇이 바뀌었는지 데이터로 원인을 좁혀 갑니다.",
      },
      {
        title: "개발",
        body: "대응에 필요한 도구와 방식을 개발팀이 바로 만듭니다.",
      },
      {
        title: "반영",
        body: "만든 것을 즉시 적용하고, 결과를 다시 지켜봅니다.",
      },
    ],
    loopBack: "다시 감지로, 24시간 반복",
  },

  /**
   * SOLUTION 다음 — "풀스택 개발자와 정규직 마케터가 끝까지 책임집니다".
   * 받은 레퍼런스(정규직 마케터 책임 + 겹친 원 셋)의 구성을 빌리고
   * 문구는 다이버즈 기준으로 새로 썼다. title 은 [문구, 강조 여부] 조각.
   */
  crew: {
    title: [
      ["풀스택 개발자", true],
      ["와 ", false],
      ["평균 5년 이상 경력의 전문 마케터", true],
      ["가\n끝까지 책임집니다", false],
    ] as [string, boolean][],
    items: [
      {
        icon: "code",
        title: "풀스택 개발팀 직접 운영",
        body: "풀스택 개발팀이 24시간 모니터링을 통해\n변경되는 로직에 실시간으로 대응합니다.",
      },
      {
        icon: "person",
        title: "1:1 전문 컨설턴트",
        body: "광고의 시작부터 끝까지\n전문 컨설턴트가 1:1로 밀착 관리해 드립니다.",
      },
      {
        icon: "talk",
        title: "매일 운영관리 지원",
        body: "순위 보고 등 운영 현황을\n담당 컨설턴트가 매일 공유해 드립니다.",
      },
    ] as { icon: "code" | "person" | "talk"; title: string; body: string }[],
  },

  team: {
    title: "처음부터 끝까지\n전담 매니저가 책임집니다.",
    items: [
      {
        title: "전담 매니저 배정",
        body: "상담부터 운영, 리포트까지 한 담당자가 맡아 끝까지 챙깁니다.",
      },
      {
        title: "직접 운영하는 리워드 솔루션",
        body: "보상형 광고 플랫폼 운영과 API/SDK 연동을 직접 해 와 실행이 빠릅니다.",
      },
      {
        title: "솔직한 피드백",
        body: "되는 것과 안 되는 것을 처음부터 분명하게 말씀드립니다.",
      },
    ],
  },

  risk: {
    title: "상위노출은 목적과 상황에 맞게,\n리스크를 알고 선택해야 합니다.",
    items: [
      {
        title: "리스크는 있습니다.\n중요한 건 대응입니다.",
        body: "플랫폼 정책이 바뀌는 시장에서 리스크가 없다고 말하는 곳은 없습니다. 다이버즈는 매일 지표를 보고 문제가 보이면 바로 조정합니다.",
      },
      {
        title: "모든 상품을\n받지는 않습니다.",
        body: "진단에서 상품 경쟁력과 키워드 상황을 먼저 봅니다. 상위노출로 성과를 내기 어려운 상품이면 솔직하게 말씀드립니다.",
      },
      {
        title: "숫자를\n숨기지 않습니다.",
        body: "진행 과정과 순위 변화를 그대로 공유하고 성과로 증명합니다.",
      },
    ],
  },

  apply: {
    title: "지금 내 상품 순위,\n무료로 진단받으세요.",
    body: "남겨 주신 연락처로 담당자가 직접 연락드립니다.",
  },
} as const;

/**
 * 알림 바("오늘 N명이 보고 M명이 문의했어요")가 숫자를 세는 랜딩 목록.
 * 키는 랜딩 경로, 값은 그 랜딩 문의의 문의유형(contacts.inquiry_types).
 *
 * API(/api/landing-stats)는 여기 있는 경로만 받는다 — 아무 경로나 받으면
 * 누구든 방문 기록 표에 쓰레기 줄을 쌓을 수 있다.
 */
export const landingStatsTargets: Record<string, string> = {
  [rankingLanding.path]: rankingLanding.inquiryType,
};
