/**
 * 사이트 전역에서 쓰는 실제 회사 정보와 콘텐츠.
 * 출처: diverz.kr (2026-07 기준). 카피를 고칠 일이 생기면 여기만 고친다.
 */

export const company = {
  name: "주식회사 다이버즈",
  nameEn: "DIVERZ",
  ceo: "전재민",
  bizNumber: "174-88-03266",
  address: "경기도 고양시 일산동구 백마로 195, 5007호",
  email: "diverz1225@gmail.com",
  tagline: "가장 깊이 잠수하고, 빠르게 떠오릅니다.",
  slogan: ["DIVE DEEP", "RISE FAST"] as const,
  // "\n"으로 줄을 나눈다. 화면에서는 줄바꿈으로, 메타데이터에서는 공백으로 처리한다.
  intro:
    "브랜드의 본질과 시장의 흐름을\n**집요하게 파고들고** 누구보다\n**더 빠른 성장을** 만들어냅니다.",
  // intro와 같은 규칙 — "\n"은 화면에서만 줄바꿈, 메타데이터에서는 공백.
  // 좁은 화면에서 자연 개행에 맡기면 "IMC 마케팅 / 그룹입니다."처럼
  // 고유명사 한가운데가 갈려서 여기서 끊는 자리를 정해 둔다.
  positioning: "우리는 브랜드를 발굴하고 성장시키는\nIMC 마케팅 그룹입니다.",
} as const;

/**
 * 회사소개서 다운로드. `path`에 실제 파일이 있을 때만 푸터에 버튼이 뜬다.
 * 파일을 바꿔 넣을 때는 public/files/ 아래에 같은 이름으로 덮어쓰면 된다.
 */
export const companyProfile = {
  path: "/files/diverz-company-profile.pdf",
  /** 사용자가 저장할 때 보이는 파일명. */
  filename: "다이버즈_회사소개서.pdf",
} as const;

export type NavItem = {
  href: string;
  label: string;
  /** 드롭다운. 항목이 한 단계 더 들어가야 하면 여기에 또 children을 둔다. */
  children?: readonly NavItem[];
};

/**
 * 상단 내비게이션.
 * 서비스는 원페이지라 모두 /service 안의 앵커를 가리킨다.
 */
export const nav: readonly NavItem[] = [
  { href: "/who-we-are", label: "WHO WE ARE" },
  {
    href: "/service",
    label: "SERVICE",
    children: [
      { href: "/service/imc", label: "IMC 마케팅" },
      { href: "/service/performance", label: "퍼포먼스 마케팅" },
      { href: "/service/viral", label: "바이럴 솔루션" },
      { href: "/service/global", label: "글로벌 마케팅" },
      { href: "/service/contents", label: "콘텐츠" },
    ],
  },
  { href: "/work", label: "WORK" },
  { href: "/contact", label: "CONTACT" },
];

/** 홈 WHAT WE DO — 브랜드의 3축 */
/**
 * 성과 수치. 홈 WHY DIVERZ 섹션에 위에서 아래로 쌓인다.
 *
 * "누적 캠페인 129,645"는 뺐다 — 아래 strengths 의 "캠페인 수행 100만 건"과
 * 자릿수가 맞지 않아 한 페이지 안에서 서로를 무너뜨리던 수치다. 대신
 * 클라이언트 수와 프로젝트 수로 갈랐다.
 */
export const stats = [
  { label: "재계약률", value: 90, suffix: "%+", note: "다시 찾는 파트너" },
  { label: "누적 클라이언트", value: 300, suffix: "+", note: "함께한 브랜드" },
  { label: "누적 프로젝트", value: 5000, suffix: "+", note: "업종 불문 실행" },
] as const;

/** WHO WE ARE — 5단계 프로세스 */
export const process = [
  {
    no: "01",
    en: "DIVE DEEP",
    title: "문제의 뿌리까지 깊게 탐색합니다",
    body: "브랜드의 현황, 시장 흐름, 소비자 데이터 등 눈에 보이지 않던 문제의 뿌리까지 탐색하는 깊이 있는 분석을 합니다.",
  },
  {
    no: "02",
    en: "DESIGN",
    title: "구조를 전략적으로 설계합니다",
    body: "인사이트를 기반으로 브랜드만의 전환 여정을 설계하고, 모든 전환을 위한 전략적 퍼널을 디자인합니다.",
  },
  {
    no: "03",
    en: "DRIVE",
    title: "민첩하고 정교하게 실행합니다",
    body: "빠르고 유연하게 실행하는 능력, 데이터 기반의 퍼포먼스 중심 운영을 집행합니다.",
  },
  {
    no: "04",
    en: "RISE",
    title: "수면 위로 끌어올립니다",
    body: "실행의 결과를 빠르게 끌어올려 명확한 성장을 만들어냅니다.",
  },
  {
    no: "05",
    en: "REPEAT",
    title: "성공 공식을 구조화합니다",
    body: "일회성 운영이 아닌, 지속 가능한 성장의 사이클을 만듭니다.",
  },
] as const;

/** 팀 카드 배경용 Unsplash URL 빌더. 카드가 커서 폭을 넉넉히 받는다. */
const TEAM_PHOTO = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=70`;

/**
 * 팀 구성.
 * `short`는 카드 위 작은 라벨, `image`는 카드 배경.
 * 실제 팀 사진이 준비되면 image만 public 경로로 바꾸면 된다.
 * (streamImages와 같은 Unsplash 소스를 쓴다 — 이미 홈에서 검증된 이미지들)
 */
export const team = [
  {
    role: "Brand Strategists",
    short: "브랜드 전략",
    body: "브랜드의 방향성을 정의하고, 시장 내 포지셔닝 전략을 수립합니다.",
    image: TEAM_PHOTO("1552664730-d307ca884978"),
  },
  {
    role: "Marketing Planners",
    short: "마케팅 기획",
    body: "브랜드의 전환과 성장을 이끄는 마케팅 퍼널과 캠페인을 설계합니다.",
    image: TEAM_PHOTO("1454165804606-c3d57bc86b40"),
  },
  {
    role: "Performance Marketers",
    short: "퍼포먼스",
    body: "광고 데이터를 정밀하게 분석하고, ROAS 중심의 효율을 극대화합니다.",
    image: TEAM_PHOTO("1551288049-bebda4e38f71"),
  },
  {
    role: "Content Creators",
    short: "콘텐츠 제작",
    body: "인플루언서 시딩부터 바이럴 영상, 광고용 숏폼까지 성과 중심 콘텐츠를 기획·제작합니다.",
    image: TEAM_PHOTO("1497366754035-f200968a6e72"),
  },
  {
    role: "Developers",
    short: "개발",
    body: "다양한 광고상품 및 리워드 마케팅 솔루션을 개발하고, 시스템화하여 마케팅 효율을 높입니다.",
    image: TEAM_PHOTO("1531973576160-7125cd663d86"),
  },
  {
    role: "Creative Designers",
    short: "디자인",
    body: "브랜드와 캠페인에 최적화된 디자인 시스템을 구축합니다.",
    image: TEAM_PHOTO("1517245386807-bb43f82c33c4"),
  },
] as const;

/**
 * SERVICE — 서비스 라인업.
 * `en`은 섹션 상단 라벨. IMC/CONTENTS/VIRAL/PERFORMANCE는 원본 표기를 따랐다.
 * 글로벌 마케팅의 요약/키워드는 확정 전 초안이다(해당 항목 주석 참고).
 * 순서: IMC → 퍼포먼스 → 바이럴 → 글로벌 → 콘텐츠.
 */
export const services = [
  {
    slug: "imc",
    // 실제 다이버즈 팀 촬영 사진("Integrated Marketing" 화면).
    image: "/images/service/imc.png",
    en: "IMC MARKETING",
    name: "IMC 마케팅",
    /** 영문 제목 아래 붙는 국문 한 줄. "\n"으로 줄을 나눈다. */
    // 쉼표에서 끊는다 — 두 줄이 "무엇으로(전략)" / "무엇을 한다(설계)"로
    // 갈려서, 자연 개행에 맡길 때보다 읽는 호흡이 맞는다.
    tagline: "하나의 전략으로,\n채널별 실행을 설계합니다",
    // 줄바꿈을 강제하지 않는다 — 문장마다 "\n"으로 끊으면 컬럼 폭이 바뀔 때
    // 마지막 한두 글자가 다음 줄에 혼자 남는 고아 줄이 생긴다. 자연 개행에 맡긴다.
    summary:
      "다이버즈는 광고, 콘텐츠, 바이럴, 오프라인 캠페인을 따로 운영하지 않습니다. " +
      "브랜드의 목표와 메시지를 먼저 정리하고, 각 채널의 역할에 맞게 실행 방향을 설계해 하나의 흐름으로 움직이게 만듭니다.",
    points: ["채널 통합 전략", "메시지 일관성", "전환 퍼널 설계"],
  },
  {
    slug: "performance",
    // 실제 다이버즈 팀 촬영 사진.
    image: "/images/service/performance.png",
    en: "PERFORMANCE MARKETING",
    name: "퍼포먼스 마케팅",
    // IMC와 같은 규칙 — 쉼표에서 끊어 앞뒤 두 마디가 대구를 이루게 한다.
    tagline: "예산은 효율적으로,\n성과는 더 선명하게",
    summary:
      "다이버즈는 META, GDN, NAVER 등 주요 광고 채널을 브랜드 목표에 맞게 운영합니다. " +
      "광고비가 단순 노출로 끝나지 않도록 유입, 전환, 구매 데이터를 확인하며 효율이 좋은 소재와 타깃을 중심으로 지속적으로 개선합니다.",
    points: [
      "ROAS 중심 운영",
      "META",
      "GDN",
      "NAVER",
      "검색광고",
      "월별 리포트",
    ],
  },
  {
    slug: "viral",
    // 실제 다이버즈 팀 촬영 사진.
    image: "/images/service/viral.png",
    en: "VIRAL",
    name: "바이럴 솔루션",
    // 이 상품의 얼굴은 솔루션 브랜드(블루에그) 자체다. 예전에는 "스스로
    // 퍼지게 설계하는 바이럴 확산 구조"라는 일반 카피가 제목이고 블루에그는
    // 아래 하위 블록에 있었는데, 정작 파는 것이 플랫폼이라 순서가 뒤집혀
    // 있었다.
    tagline: "바이럴 마케팅 솔루션\n블루에그",
    summary:
      "블루에그는 브랜드가 직접 리워드와 리뷰 캠페인을 세팅하고 운영할 수 있는 셀프 마케팅 플랫폼입니다. " +
      "대행 수수료 부담 없이 원하는 조건으로 캠페인을 집행하고, 네이버 블로그·카페·리뷰 마케팅을 합리적으로 확장할 수 있습니다.",
    points: [
      "셀프마케팅",
      "네이버 플레이스",
      "네이버 쇼핑",
      "쿠팡",
      "리워드",
      "리뷰체험단",
      "순위추적",
    ],
  },
  {
    slug: "global",
    // 실제 다이버즈 팀 촬영 사진.
    image: "/images/service/global.png",
    en: "GLOBAL MARKETING",
    name: "글로벌 마케팅",
    // 줄바꿈 자리를 "확장하는" 앞에서 뒤로 옮겼다. 앞 줄이 컬럼 폭보다
    // 길어서 자연 개행이 한 번 더 일어나 세 줄로 깨져 있었다.
    tagline: "현지 인플루언서와 플랫폼으로\n확장하는 글로벌 마케팅",
    // 중국(샤오홍슈·따종디엔핑)과 일본·대만 인플루언서 채널이 핵심이다.
    // 예전 문구는 아마존 리스팅 최적화가 중심이었는데, 실제로 하는 일은
    // 현지 인플루언서를 통한 노출 쪽이라 그에 맞춰 다시 썼다.
    summary:
      "다이버즈는 중국 샤오홍슈와 따종디엔핑, 일본/대만 인플루언서 채널을 활용해 " +
      "브랜드와 상품을 현지 고객에게 자연스럽게 노출합니다. " +
      "국가별 플랫폼 특성과 소비자 반응에 맞춰 리뷰, 체험, 바이럴 콘텐츠를 기획하고 " +
      "해외 고객과의 접점을 만들어갑니다.",
    points: [
      "중국",
      "일본",
      "대만",
      "미국",
      "인플루언서",
      "현지 운영 관리",
      "해외 플랫폼 노출",
    ],
  },
  {
    slug: "contents",
    // 실제 다이버즈 팀 촬영 사진.
    image: "/images/service/contents.png",
    en: "CONTENTS",
    name: "콘텐츠",
    // 두 줄로 끊는 자리는 "기획하고" 뒤. 앞 줄이 컬럼 폭보다 길면 자연 개행이
    // 한 번 더 일어나 세 줄로 깨진다(글로벌에서 겪었다).
    tagline: "채널에 맞는 콘텐츠를\n기획하고 제작합니다",
    summary:
      "상세페이지, 광고 이미지, 숏폼 영상, SNS 콘텐츠까지 목적에 맞는 콘텐츠를 제작합니다. " +
      "브랜드의 강점이 고객에게 명확하게 전달되도록 기획부터 디자인, 카피, 소재 제작까지 함께 진행합니다.",
    points: ["홈페이지", "상세페이지", "숏폼", "릴스", "광고소재", "영상제작"],
  },
] as const;

/** IMC 마케팅 6단계 */
export const imcProcess = [
  { no: "01", title: "브랜드 진단", body: "업종, 타겟, 제품·서비스 진단" },
  { no: "02", title: "메시지 정의", body: "캠페인 목적에 따른 메시지 정립" },
  {
    no: "03",
    title: "채널 믹스 설계",
    body: "타겟별 채널 효율 분석 기반 믹스",
  },
  { no: "04", title: "전환 퍼널 설계", body: "고객 여정 중심 KPI 세팅" },
  {
    no: "05",
    title: "콘텐츠 통합 기획",
    body: "비주얼, 영상, 카피라이팅 제작",
  },
  { no: "06", title: "성과 분석", body: "리포트 기반 자동 최적화" },
] as const;

/** 퍼포먼스 마케팅 — 다크 카드 왼쪽의 강점 3가지. 첫 항목만 포인트 컬러다. */
export const performanceFeatures = [
  {
    title: "A/B 테스트 기반 최적화",
    body: "소재별 반응률, 유입률, 구매 전환율 비교하여 실시간 테스트 및 교체 프로세스 진행하여 효율 극대화",
  },
  {
    title: "전환 퍼널 설계",
    body: "브랜드 / 상품 / 서비스 성격에 맞는 고객 여정 설계 후 전환을 위한 전략 적용",
  },
  {
    title: "리마케팅, 리타겟 리치 확장",
    body: "리타겟 기반 상품/서비스 재노출, KPI 전환율 향상 후 고객 매칭 기반 타겟 확장 전략",
  },
] as const;

/**
 * 퍼포먼스 마케팅 — 다크 카드 오른쪽의 성과 곡선 4단계.
 * "\n"으로 줄을 나눈다. above가 true면 곡선 위, false면 아래에 라벨을 둔다.
 * 곡선은 이 4단계 뒤로 라벨 없는 정점까지 한 번 더 올라간다(컴포넌트에서 처리).
 */
export const performanceFunnel = [
  {
    title: "아이디어 &\n가설 수립",
    body: "성과를 끌어낼 수 있는\n메시지와 구조를\n사전에 설계합니다.",
    above: true,
  },
  {
    title: "A/B\n테스트",
    body: "가설을 실험해\n최적의 크리에이티브와\n타겟 조합을 찾아냅니다.",
    above: true,
  },
  {
    title: "데이터 분석을 통한\n성과 검증",
    body: "실시간 데이터를 기반으로\n효율을 분석하고\n개선 포인트를 도출합니다.",
    above: false,
  },
  {
    title: "리마케팅 &\n리치 확장",
    body: "성과가 검증된 타겟을 중심으로\n도달 범위를 넓혀\n전환을 극대화합니다.",
    above: false,
  },
] as const;

/** WORK — 케이스 스터디 */
/**
 * 바이럴 채널 3종 — 서비스 페이지 VIRAL 블록.
 * 기존 사이트 diverz.kr/viralmarketing 의 내용을 그대로 옮겼다.
 *
 * logo는 채널명 옆에 붙는 작은 마크다. 원본은 "Service page/viral/"에 있고,
 * 크기를 서로 맞춘 정사각 파일을 scripts/normalize-viral-logos.mjs가 만든다.
 */
/**
 * 바이럴 솔루션의 구성.
 *
 * 브랜드(블루에그)가 위에 있고, 그 아래 프로그램 둘(바이럴 마케팅 ·
 * 리워드 마케팅)이 달린다. 둘은 순서가 있는 단계가 아니라 나란한 갈래라
 * 번호를 붙이지 않는다.
 *
 * 각 프로그램에 실리는 내용은 아래 데이터를 그대로 쓴다 —
 *   바이럴 마케팅 → 아래 programs.viral 의 summary · points
 *   리워드 마케팅 → searchRankingBoost (플레이스 · 스마트스토어) + smartstoreRankings
 */
export const viralSolution = {
  en: "BLUE EGG",
  name: "바이럴 마케팅 솔루션 블루에그",
  programs: {
    /**
     * 바이럴 마케팅.
     *
     * 설명은 예전 채널 카드(네이버·인스타그램) 본문을 한 문단으로 합친 것이다
     * — 카드 셋을 나란히 세우던 판형을 위 블루에그 블록과 같은
     * "제목 → 설명 → 키워드"로 맞추면서, 문장은 쓰던 것을 그대로 옮겼다.
     * 당근은 뺐다.
     */
    viral: {
      en: "VIRAL MARKETING",
      /** 프로그램 이름(식별용). 화면에 크게 나가는 건 아래 title 이다. */
      name: "바이럴 마케팅",
      title: "노출과 전환을 높이는 바이럴 최적화",
      summary:
        "네이버 플레이스와 네이버 쇼핑에서 브랜드와 상품이 더 잘 발견되고 선택될 수 있도록 노출 구조를 최적화합니다. " +
        "키워드, 리뷰, 콘텐츠, 순위 흐름을 함께 관리해 검색 유입부터 실제 전환까지 이어지는 바이럴 마케팅을 운영합니다.",
      points: [
        "네이버 블로그",
        "네이버 카페",
        "상위노출",
        "리뷰체험단",
        "인스타그램 시딩",
        "인기게시물",
      ],
    },
    /**
     * 리워드 마케팅. 내용은 리워드 솔루션 소개 자료에서 옮겼다.
     *
     * items 는 다섯 갈래인데 순서가 있는 단계는 아니다 — 나란한 특성이라
     * 화면에서도 번호 없이 가로로 편다.
     */
    reward: {
      en: "REWARD MARKETING",
      name: "리워드 마케팅",
      title: "리워드로 만드는 효율적인 유입 구조",
      summary:
        "보상을 통해 고객의 참여를 유도하고, 실제 방문·리뷰·구매 행동으로 이어질 수 있도록 캠페인을 운영합니다. " +
        "브랜드 목표에 맞춰 리워드 조건과 참여 방식을 설계해 비용 대비 효율적인 성과를 만듭니다.",
      points: [
        "리워드개발",
        "네이버 플레이스 상위노출",
        "네이버 쇼핑 상위노출",
        "보장형",
        "관리형",
      ],
      items: [
        {
          title: "브랜드 노출\n효과 극대화",
          body: "CPA, CPQ 등 보상 기반으로 광고 참여를 유도하여 트래픽을 공급합니다.",
        },
        {
          title: "맞춤형\n보상 설계",
          body: "캠페인 KPI에 따라 포인트, 쿠폰, 적립금 등 유연한 보상 구조를 연동합니다.",
        },
        {
          title: "트래픽\n품질 관리",
          body: "중복 유저와 무효 클릭을 걸러내는 필터링 기술로 정량과 정성 성과를 함께 보장합니다.",
        },
        {
          title: "AD-Tech\n기반 실행",
          body: "다양한 보상형 광고 플랫폼을 운영하고 API 연동과 SDK 개발을 지원합니다.",
        },
        {
          title: "관리 전용\n대시보드",
          body: "실시간 데이터 확인, 유입 분석, 참여율 추적 리포트를 제공합니다.",
        },
      ],
    },
  },
} as const;

/**
 * 상위노출 2종 — 서비스 페이지 VIRAL 블록의 두 번째 묶음.
 * 기존 사이트 diverz.kr/35 (SEARCH RANKING BOOST)의 내용을 그대로 옮겼다.
 * 바이럴과 별개 서비스지만 이 사이트에서는 VIRAL 안의 키워드로 묶여 있어
 * (points에 "상위노출"이 있다) 같은 블록에서 이어 보여 준다.
 */
/**
 * 상위노출 실적 — 키워드별 순위 상승 기록.
 * from(초기 순위) → to(현재 순위). 상승 폭은 화면에서 from - to로 계산한다.
 *
 * 채널별로 한 벌씩 둔다. 화면에서는 플레이스가 위, 쇼핑이 아래로 온다.
 */
export const placeRankings = [
  { keyword: "미용실", from: 67, to: 1 },
  { keyword: "맛집", from: 45, to: 2 },
  { keyword: "병원", from: 103, to: 2 },
  { keyword: "마사지", from: 68, to: 1 },
  { keyword: "가구점", from: 240, to: 1 },
] as const;

export const smartstoreRankings = [
  { keyword: "애견용품", from: 24, to: 2 },
  { keyword: "낚시용품", from: 72, to: 1 },
  { keyword: "샴푸", from: 25, to: 3 },
  { keyword: "방향제", from: 122, to: 1 },
  { keyword: "스킨케어", from: 169, to: 1 },
] as const;

export const searchRankingBoost = [
  {
    en: "NAVER PLACE",
    logo: "/images/viral/naver-place.png",
    title: "플레이스 상위노출",
    body:
      "블로그 리뷰, 영수증 리뷰, 리워드 트래픽, 저장하기 등 다양한 사용자 행동 데이터를 정교하게 설계합니다. " +
      "단순 광고가 아닌, 네이버 알고리즘에 최적화된 유기적 노출 구조를 통해 브랜드의 플레이스 상위노출을 안정적으로 만들어 냅니다.",
  },
  {
    // TODO: 로고 원본 없음. "Service page/viral/"에 스마트스토어 파일이 들어오면
    // scripts/normalize-viral-logos.mjs의 FILES에 추가하고 여기 logo를 채운다.
    en: "NAVER SMARTSTORE",
    title: "스마트스토어 상위노출",
    body:
      "SEO 최적화부터 상품 찜, 관심고객수, 리워드 기반 트래픽까지. " +
      "스마트스토어의 검색 상위노출을 위해 주요 지표들을 정교하게 조합해 노출 경쟁력을 높이고 실질적인 매출 성장을 유도합니다.",
  },
] as const;

/**
 * 담당 업종 — PARTNERS 섹션에서 로고 월 위에 온다.
 *
 * 예전에는 여섯 업종에 브랜드명을 나열했는데(아래 clientCategories),
 * 로고 월이 바로 아래에서 같은 브랜드를 이미지로 또 보여 줘서 같은 말을
 * 두 번 했다. 지금은 "얼마나 넓은 업종을 다루는가"만 말한다 —
 * 왼쪽에 숫자, 오른쪽에 업종 이름.
 */
export const clientIndustries = {
  stats: [
    { label: "담당업종", value: "20+" },
    { label: "세부업종", value: "100+" },
  ],
  /** 표기의 "/"는 원본 그대로다. 줄바꿈은 화면 폭에 맡긴다. */
  names: [
    "종합쇼핑",
    "부동산",
    "교육",
    "결혼/출산/육아",
    "산업지원",
    "가정/생활",
    "여행/교통",
    "IT/통신",
    "취업",
    "전문서비스",
    "식품/음료",
    "가전/전기",
    "자동차",
    "인쇄/문구/사무기기",
    "의료/건강",
    "금융/보험",
    "인테리어",
    "관공서/단체",
    "의류/패션잡화",
    "레저/취미",
    "건축",
    "기타",
  ],
} as const;

/**
 * 업종별 클라이언트 브랜드명.
 *
 * 지금은 화면에서 쓰지 않는다(위 clientIndustries 로 대체). 다른 어디에도
 * 적혀 있지 않은 실제 클라이언트 목록이라 지우지 않고 남겨 둔다.
 */
export const clientCategories = [
  {
    name: "식·음료",
    brands:
      "매일유업, 보타니티, 아임뮨, 헬로네이처, 한미헬스케어, 바르닭, 아워홈, 캘리스코",
  },
  {
    name: "뷰티",
    brands:
      "메디힐, 토니모리, 이즈앤트리, 아이소이, 더샘, 클레어스, 메스티나, 그린핑거, 필립스오토모티브",
  },
  {
    name: "생활용품",
    brands: "에티카, 닥터퓨리, 아에르, 유한킴벌리, 3M, 우피아",
  },
  {
    name: "쇼핑·여행",
    brands: "신세계까사, 텐바이텐, 트렌비, 코웰패션, 제주항공, 웹투어",
  },
  {
    name: "금융·보험",
    brands: "기업은행, 신한은행, 전북은행, 피플라이프",
  },
  {
    name: "교육",
    brands: "EBS랑, 대성마이맥, 야나두, 시원스쿨, 이투스247, 한솔요리학원",
  },
] as const;

export const cases = [
  {
    client: "A지역 피부과",
    headline: "1개월 만에 일매출 10배 성장",
    /** 성장 그래프(투명 PNG). -curve 는 원본의 빈 여백을 잘라낸 것 —
     *  단 폭을 꽉 채워야 카드가 단정하게 떨어진다. 원본도 같은 폴더에 있다. */
    graph: "/images/cases/case-01-curve.png",
    problem: "홍보 부족으로 일매출 정체, 신규 환자 유입 저조",
    strategy: "검색광고 + SNS 채널 병행, 예약 유도 콘텐츠 집중 운영",
    result: "1달 만에 일매출 10배 상승, ROI 512% 달성",
    metrics: [
      { label: "일매출", value: "10배" },
      { label: "ROI", value: "512%" },
      { label: "기간", value: "1개월" },
    ],
  },
  {
    client: "F&B 브랜드 본사",
    headline: "IMC 전략으로 가맹 확장과 매출 성장을 동시에",
    graph: "/images/cases/case-02-curve.png",
    problem: "브랜드 인지도는 있으나, 가맹 확장과 가맹점별 매출 상승이 정체",
    strategy:
      "IMC 마케팅으로 브랜드 메시지를 통합하고, 가맹 모집부터 활성화까지 전체 흐름을 설계",
    result: "6개월간 가맹점 3배 증가, 평균 매출 60% 상승",
    metrics: [
      { label: "가맹점", value: "3배" },
      { label: "평균 매출", value: "+60%" },
      { label: "기간", value: "6개월" },
    ],
  },
] as const;

/** 고객 후기 — src는 추후 실제 사진으로 교체(같은 경로 파일만 바꾸면 됨) */
/**
 * 함께한 클라이언트 로고 — "소상공인부터 기업까지" 섹션의 로고 월.
 *
 * src는 public 기준 경로. 파일을 아직 안 넣었으면 빈 문자열로 두면 되고,
 * 그 자리에는 회색 자리표시자가 대신 그려진다. 로고는 배경이 없는
 * SVG(또는 투명 PNG)를 권장한다 — 카드가 흰색이라 흰 배경이 겹치면 티가 난다.
 */
/**
 * IMC 마케팅이 다루는 채널 로고 — 서비스 페이지 IMC 블록의 로고 궤도
 * (components/logo-orbit.tsx)에 걸린다.
 *
 * src는 원형 칩에 맞춰 정사각으로 다시 뽑은 파일이다. 원본은 출처가 달라
 * 비율도 여백도 제각각이라 그대로 쓰면 크기가 들쭉날쭉해진다.
 * 원본 위치와 재생성: scripts/normalize-imc-logos.mjs
 * (로고를 더하거나 뺄 때는 그 스크립트의 FILES와 여기를 같이 고친다)
 */
export const imcChannels = [
  { name: "Meta", src: "/images/imc/meta.png" },
  { name: "Google", src: "/images/imc/google.png" },
  {
    name: "Google Display Network",
    src: "/images/imc/google-display-network.png",
  },
  { name: "네이버", src: "/images/imc/naver.png" },
  { name: "TikTok", src: "/images/imc/tiktok.png" },
  { name: "쿠팡", src: "/images/imc/coupang.png" },
  { name: "당근", src: "/images/imc/karrot.png" },
] as const;

/**
 * 퍼포먼스 마케팅 블록 오른쪽에 3x2로 놓는 채널 로고.
 * src는 정사각 칩에 맞춰 정규화한 파일이다. 원본 위치와 재생성:
 * scripts/normalize-performance-logos.mjs
 * (로고를 더하거나 뺄 때는 그 스크립트의 FILES와 여기를 같이 고친다)
 */
export const performanceChannels = [
  { name: "Meta", src: "/images/performance/meta.png" },
  { name: "Google", src: "/images/performance/google.png" },
  { name: "네이버", src: "/images/performance/naver.png" },
  { name: "Instagram", src: "/images/performance/instagram.png" },
  { name: "YouTube", src: "/images/performance/youtube.png" },
  { name: "Google Analytics", src: "/images/performance/google-analytics.png" },
] as const;

/**
 * 클라이언트 로고 — "업체 로고/" 폴더(실제 거래 업체 로고 원본)에서 뽑았다.
 * 3줄 마퀴가 서로 반대 방향으로 흐르며 스쳐 지나가는 연출이라
 * (components/client-logos.tsx) 업종별로 묶을 필요가 없어 카테고리 없이
 * 평평한 목록으로 둔다. 순서는 한쪽에 업종이 몰리지 않도록 미리 섞어
 * 고정해 뒀다 — 매 렌더마다 무작위로 섞으면 서버/클라이언트 렌더 결과가
 * 달라져 하이드레이션이 어긋나므로 리터럴 순서 자체를 섞는다.
 */
export const clientLogos = [
  { name: "Hennessy", src: "/images/clients/hennessy.png" },
  { name: "깐부치킨", src: "/images/clients/kkanbu-chicken.png" },
  { name: "AXA", src: "/images/clients/axa.png" },
  { name: "고향의봄", src: "/images/clients/hometown-spring.png" },
  { name: "Bentley", src: "/images/clients/bentley.png" },
  { name: "웅진", src: "/images/clients/woongjin.png" },
  {
    name: "THE HANOI FOOT&BODY",
    src: "/images/clients/the-hanoi-foot-body.png",
  },
  { name: "KB국민카드", src: "/images/clients/kb-card.png" },
  { name: "Sealy", src: "/images/clients/sealy.png" },
  { name: "SOOP", src: "/images/clients/soop.png" },
  { name: "우다다", src: "/images/clients/udada.png" },
  { name: "메리츠화재", src: "/images/clients/meritz-fire.png" },
  { name: "The Balvenie", src: "/images/clients/the-balvenie.png" },
  { name: "직폰", src: "/images/clients/ziphone.png" },
  { name: "아모레퍼시픽", src: "/images/clients/amorepacific.png" },
  { name: "MONOCUS", src: "/images/clients/monocus.png" },
  { name: "Rolls-Royce", src: "/images/clients/rolls-royce.png" },
  { name: "린센다이닝", src: "/images/clients/linsen-dining.png" },
  { name: "하이투자증권", src: "/images/clients/dgb-hi-investment.png" },
  { name: "Care by Me", src: "/images/clients/care-by-me.png" },
  { name: "NS홈쇼핑", src: "/images/clients/ns-homeshopping.png" },
  { name: "dr ROBBIN", src: "/images/clients/dr-robbin.png" },
  { name: "라이나생명", src: "/images/clients/lina-life.png" },
  { name: "웨이브히어링", src: "/images/clients/wave-hearing.png" },
  { name: "Porsche", src: "/images/clients/porsche.png" },
  { name: "우피아", src: "/images/clients/uffia.png" },
  { name: "TV조선", src: "/images/clients/tv-chosun.png" },
  { name: "살롱드하루", src: "/images/clients/salon-de-haru.png" },
  { name: "삼성카드", src: "/images/clients/samsung-card.png" },
  { name: "이품고", src: "/images/clients/ipoomgo.png" },
  { name: "한화손해보험", src: "/images/clients/hanwha-insurance.png" },
  { name: "BODYBEAN PILATES", src: "/images/clients/bodybean-pilates.png" },
  { name: "코인원", src: "/images/clients/coinone.png" },
  { name: "ALLERMAN", src: "/images/clients/allerman.png" },
  { name: "SK브로드밴드", src: "/images/clients/sk-broadband.png" },
  { name: "오키파", src: "/images/clients/okipa.png" },
  { name: "미래에셋증권", src: "/images/clients/mirae-asset.png" },
  { name: "SHINE U CLINIC", src: "/images/clients/shine-u-clinic.png" },
  { name: "현대해상", src: "/images/clients/hyundai-insurance.png" },
  { name: "Odorr", src: "/images/clients/odorr.png" },
  { name: "한국경제TV", src: "/images/clients/hankyung-tv.png" },
  { name: "THE LITER", src: "/images/clients/the-liter.png" },
  { name: "HERMÈS", src: "/images/clients/hermes.png" },
  { name: "DB손해보험", src: "/images/clients/db-insurance.png" },
  { name: "Hendrick's Gin", src: "/images/clients/hendricks-gin.png" },
  { name: "Lillet", src: "/images/clients/lillet.png" },
] as const;

/**
 * 강점 요약. label(작게)/value(크게) 두 줄로 읽힌다.
 *
 * 4번 "캠페인 수행 100만 건"은 stats 에서 캠페인 수치를 뺀 지금 이 페이지에
 * 남은 유일한 캠페인 표기다. stats 의 "누적 프로젝트 5,000"과는 세는 단위가
 * 달라 충돌하지 않지만, 어느 한쪽을 고칠 일이 생기면 같이 확인해야 한다.
 */
export const strengths = [
  { label: "요식업, 뷰티, 병원 등", value: "다양한 업종별 성과 경험" },
  { label: "브랜딩 / 콘텐츠 / 바이럴 / 퍼포먼스", value: "올인원 조직" },
  { label: "재계약률", value: "90% 이상" },
  { label: "캠페인 수행", value: "100만 건" },
] as const;
