/**
 * 사이트 전역에서 쓰는 실제 회사 정보와 콘텐츠.
 * 출처: diverz.kr (2026-07 기준). 카피를 고칠 일이 생기면 여기만 고친다.
 */

export const company = {
  name: "주식회사 다이버즈",
  nameEn: "DIVERZ",
  /** 공동 대표. 푸터에 이 순서 그대로 나란히 선다. */
  ceo: "전재민, 최원식",
  bizNumber: "174-88-03266",
  address: "경기도 고양시 일산동구 백마로 195, 5007호",
  email: "info@diverz.kr",
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
  { href: "/recruiting", label: "RECRUITING" },
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
  {
    label: "누적 프로젝트",
    value: 5000,
    suffix: "+",
    note: "다양한 업종 경험",
  },
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
    body: "인플루언서 시딩부터 바이럴 영상, 광고용 숏폼까지 성과 중심 콘텐츠를 기획/제작합니다.",
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
    // "따로 뛰던 채널을"은 무엇을 묶는지에 머물러 왜 묶는지(성과)가 빠졌다.
    // 쉼표에서 끊어 두 줄이 "무엇으로(전략)" / "그래서 무엇을 얻는지(성과)"로
    // 갈리게 한다 — 채널 통합은 수단이고, 실제로 파는 건 성과다.
    tagline: "하나의 전략으로,\n성과를 만듭니다",
    // 줄바꿈을 강제하지 않는다 — 문장마다 "\n"으로 끊으면 컬럼 폭이 바뀔 때
    // 마지막 한두 글자가 다음 줄에 혼자 남는 고아 줄이 생긴다. 자연 개행에 맡긴다.
    // 세 문장으로 이어 붙인다 — 문제(채널이 따로 운영될 때 생기는 일) →
    // 정의(IMC가 뭔지) → 다이버즈가 실제로 밟는 단계(구 imcProcess 6단계를
    // 표·타임라인이 아니라 문장으로 푼 것). 별도 타임라인 블록
    // (components/imc-process.tsx)을 없애면서 그 안에 있던 정의와 6단계
    // 내용을 여기로 옮겼다 — imcProcess 데이터 자체는 그대로 남아 있다.
    summary:
      "채널마다 팀이 따로 운영되면 메시지가 어긋나고 예산도 겹칩니다. " +
      "IMC(통합 마케팅 커뮤니케이션)는 이런 채널들을 하나의 메시지로 묶어 운영하는 방식입니다. " +
      "다이버즈는 브랜드 진단과 메시지 정의로 시작해 채널 믹스와 전환 퍼널을 설계하고, " +
      "콘텐츠를 통합 기획/실행한 뒤 성과를 분석해 다시 다듬는 흐름으로 움직입니다.",
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
      "대행 수수료 부담 없이 원하는 조건으로 캠페인을 집행하고, 네이버 블로그/카페/리뷰 마케팅을 합리적으로 확장할 수 있습니다.",
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
    // 이 대제목은 "무엇을 해 준다"가 아니라 "왜 지금인가"를 먼저 말한다.
    // 아래 두 상품(이커머스 입점/마케팅, 병원 마케팅)이 각자 무엇을 하는지
    // 이미 자세히 풀고 있어서, 그 위에서 같은 말을 요약하면 지면이 두 번
    // 같은 얘기를 한다. 대신 읽는 사람이 이 페이지를 계속 읽을 이유
    // ("국내가 한계면 다음은 해외")를 먼저 세운다.
    //
    // 줄을 끊는 자리는 "다음 시장은" 앞. 앞 줄이 컬럼 폭보다 길면 자연
    // 개행이 한 번 더 일어나 세 줄로 깨진다(예전 문구에서 겪었다).
    tagline: "국내 성장이 한계에 닿았다면\n다음 시장은 해외입니다",
    // 근거는 "지금 나가면 쉽다"가 아니라 "지금은 예전보다 문턱이 낮다"로
    // 잡는다 — 콰징(보세) 구조와 후기/라이브 기반 시장이 그 근거다.
    // 숫자는 넣지 않는다. 여기서 말한 값(입점 기간·비용)은 아래 상품 지면이
    // 표로 다시 말하는데, 두 자리 값이 어긋나면 제안서 개정 때 한쪽만
    // 고쳐질 자리가 된다.
    summary:
      "중국은 콰징 구조로 브랜드샵을 직접 열지 않고도 판매를 시작할 수 있고, " +
      "샤오홍슈 후기와 도우인 라이브에서는 이름이 알려지지 않은 브랜드도 하루아침에 자리를 잡습니다. " +
      "일본과 대만, 미국도 현지 인플루언서 채널이 그만큼 열려 있습니다. " +
      "다이버즈는 입점 구조부터 현지 마케팅까지 하나로 연결해, 해외 진출을 언젠가 할 일이 아니라 지금 시작할 수 있게 만듭니다.",
    points: [
      "중국",
      "일본",
      "대만",
      "미국",
      "이커머스 입점",
      "현지 인플루언서",
      "현지 운영 관리",
    ],
  },
  {
    slug: "contents",
    // 실제 다이버즈 팀 촬영 사진.
    image: "/images/service/contents.png",
    en: "CONTENTS",
    name: "콘텐츠",
    // 한 줄로 간다. 오른쪽 개념도가 빠지면서 본문이 지면 폭을 통째로
    // 쓰게 돼(components/service-detail.tsx) 끊을 이유가 없어졌다.
    // 좁은 화면에서는 자연 개행에 맡긴다(text-balance 가 길이를 고르게 나눈다).
    tagline: "채널에 맞는 콘텐츠를 기획하고 제작합니다",
    summary:
      "상세페이지, 광고 이미지, 숏폼 영상, SNS 콘텐츠까지 목적에 맞는 콘텐츠를 제작합니다. " +
      "브랜드의 강점이 고객에게 명확하게 전달되도록 기획부터 디자인, 카피, 소재 제작까지 함께 진행합니다.",
    /* 영상제작이 맨 앞이다 — 이 상품 아래로 이어지는 묶음(영상 제작 탭)이
       실제로 파는 것이고, 나머지 다섯은 그 곁가지다. */
    points: ["영상제작", "홈페이지", "상세페이지", "숏폼", "릴스", "광고소재"],
  },
] as const;

/**
 * IMC 상세 페이지 하단 — "왜 다이버즈인가" 이유 4가지(WHY DIVERZ 벤토 그리드).
 *
 * 새로 지어내지 않고 strengths(위 회사 강점 데이터)에서 그대로 끌어온다 —
 * 같은 숫자가 페이지마다 다르게 보이면 신뢰가 깎인다.
 */
export const imcWhyDiverz = {
  reasons: [
    {
      title: "올인원 조직",
      body: "브랜딩/콘텐츠/바이럴/퍼포먼스를 한 팀이 통합 운영해 채널 간 메시지가 흩어지지 않습니다.",
    },
    {
      title: "다양한 업종 경험",
      body: "요식업, 뷰티, 병원 등 다양한 업종에서 쌓은 실행 데이터로 업종별 최적 채널 믹스를 설계합니다.",
    },
    {
      title: "검증된 실행력",
      body: "누적 캠페인 100만 건을 수행하며 채널 믹스와 전환 퍼널을 실전에서 다듬어 왔습니다.",
    },
    {
      title: "높은 재계약률",
      body: "재계약률 90% 이상. 성과로 다시 찾는 파트너가 다이버즈의 실행력을 증명합니다.",
    },
  ],
} as const;

/** IMC 마케팅 6단계 */
export const imcProcess = [
  { no: "01", title: "브랜드 진단", body: "업종, 타겟, 제품/서비스 진단" },
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
  /**
   * 블루에그 탭의 제목 위에 서는 공감 한 줄.
   *
   * 셋(블루에그 · 바이럴 마케팅 · 리워드 마케팅)이 탭으로 나란히 서므로
   * 여는 방식을 맞춘다 — 글로벌 마케팅의 두 탭과 같은 문법이다
   * (ecommerceMarketing.hook · hospitalMarketing.hook). 상품 이름표(영문
   * 라벨)를 그 자리에서 밀어내고 대신 선다: 어느 상품 이야기인지는 활성
   * 탭이 이미 말해 주고, 그 자리는 읽는 사람의 마음을 먼저 받는 데 쓴다.
   *
   * 이 상품이 파는 것이 "대행 없이 직접 돌리는 플랫폼"이라, 대행을 맡겨야만
   * 한다고 여기던 자리를 먼저 뒤집는다.
   */
  hook: "바이럴 마케팅, 이제 직접 가능합니다.",
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
      /** 제목 위 공감 한 줄. 규격은 위 viralSolution.hook 주석 참고. */
      hook: "검색의 시대, 최적화되지 않으면 전환은 떨어질 수밖에 없습니다.",
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
      /** 제목 위 공감 한 줄. 규격은 위 viralSolution.hook 주석 참고. */
      hook: "상위노출로 실질적 전환을 이끌어 낼 수 있습니다.",
      title: "리워드로 만드는 효율적인 유입 구조",
      summary:
        "보상을 통해 고객의 참여를 유도하고, 실제 방문/리뷰/구매 행동으로 이어질 수 있도록 캠페인을 운영합니다. " +
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
    name: "식/음료",
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
    name: "쇼핑/여행",
    brands: "신세계까사, 텐바이텐, 트렌비, 코웰패션, 제주항공, 웹투어",
  },
  {
    name: "금융/보험",
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
    headline: "4주 만에 예약 손님 2배 증가",
    /** 성장 그래프(투명 PNG). -curve 는 원본의 빈 여백을 잘라낸 것 —
     *  단 폭을 꽉 채워야 카드가 단정하게 떨어진다. 원본도 같은 폴더에 있다. */
    graph: "/images/cases/case-01-curve.png",
    problem: "홍보 부족으로 예약 문의 정체, 신규 환자 유입 저조",
    strategy: "네이버 플레이스 상위노출 + SNS 콘텐츠 제작",
    result: "4주 만에 예약 손님 2배 증가, ROI 512% 달성",
    metrics: [
      { label: "예약 손님", value: "2배" },
      { label: "ROI", value: "512%" },
      { label: "기간", value: "4주" },
    ],
  },
  {
    client: "스킨케어 브랜드",
    headline: "6개월 만에 매출 5배 성장, 중국 진출 성공",
    graph: "/images/cases/case-02-curve.png",
    problem:
      "국내 매출은 안정적이나 신규 성장 동력 부재, 중국 진출 경험/현지 채널 없음",
    strategy:
      "중국 이커머스 입점부터 현지 채널 마케팅까지 진출 전 과정을 설계하고 대행",
    result: "6개월 만에 매출 5배 성장, 중국 시장 안착",
    metrics: [
      { label: "매출", value: "5배" },
      { label: "진출 시장", value: "중국" },
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
  { name: "Instagram", src: "/images/imc/instagram.png" },
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
 * WORK 지면의 포트폴리오.
 *
 * 격자에는 프로젝트마다 대표 컷(thumb) 한 장만 선다. 누르면 그 편의 컷
 * 전체(shots)가 모달에 세로로 이어 뜬다(components/work-projects.tsx).
 * thumb 은 shots 에 넣지 않는다 — 격자에서 이미 본 컷을 모달 첫 장에서
 * 또 만나면 다음 장이 없는 것처럼 읽힌다.
 *
 * 컷 이미지는 모두 같은 가로세로(약 1.91:1 — 영상 프레임 그대로)로 맞춰
 * 넣었다. 격자도 모달도 그 비율 상자에 object-cover 로 앉히므로, 비율이
 * 다른 그림을 넣으면 좌우가 잘린다. 넣기 전에 같은 비율로 자른다.
 *
 * /public 파일은 이름에 해시가 붙지 않는다 — 같은 이름으로 그림만 갈아
 * 끼우면 캐시가 옛 그림을 계속 물고 있으므로, 컷을 교체할 때는 파일명도
 * 함께 바꾼다.
 */
export const workProjects = [
  {
    id: "usimsa",
    /* 브랜드명은 컷 안에 로고 없이 마지막 타이틀 문구에만 나온다 —
       "요즘 유심사는 법"에서 파랗게 켜지는 "유심사"가 그 자리다.
       광고주 표기가 확인되면 여기만 고치면 된다. */
    client: "유심사",
    title: "요즘 유심사는 법",
    role: "브랜드 캠페인 영상",
    thumb: "/images/work/usimsa/usimsa-thumb.jpg",
    thumbAlt: '유심사 캠페인 영상 — 모델 클로즈업과 "세상에 그런 법이" 자막',
    shots: [
      {
        src: "/images/work/usimsa/usimsa-01.jpg",
        alt: '유심사 캠페인 영상 — 노을 진 공항 라운지에서 휴대폰을 보는 모델, "세상에 그런 법이 어딨냐고?" 자막',
      },
      {
        src: "/images/work/usimsa/usimsa-02.jpg",
        alt: '유심사 캠페인 영상 — 밤 도심 횡단보도에 선 모델, "낯선 길에선" 자막',
      },
      {
        src: "/images/work/usimsa/usimsa-03.jpg",
        alt: '유심사 캠페인 영상 — 휴대폰 위로 떠오른 사진 피드 화면, "담고 싶은 순간에" 자막',
      },
      {
        src: "/images/work/usimsa/usimsa-04.jpg",
        alt: '유심사 캠페인 영상 — 여행 기록을 콜라주로 이어 붙인 화면과 "공유를 켜는" 자막',
      },
      {
        src: "/images/work/usimsa/usimsa-05.jpg",
        alt: '유심사 캠페인 영상 — 방 안에 앉은 모델과 "요즘 유심사는 법" 타이틀',
      },
    ],
  },
  {
    id: "shoppingnt",
    client: "쇼핑엔티",
    title: "쇼핑은 티나게",
    /** 타일에 겹쳐 뜨는 한 줄 — 무엇을 한 일인지. */
    role: "브랜드 캠페인 영상",
    /** 격자에 서는 대표 컷 — 브랜드가 가장 또렷하게 읽히는 마지막 장면. */
    thumb: "/images/work/shoppingnt/shoppingnt-thumb-v2.jpg",
    thumbAlt: "쇼핑엔티 캠페인 영상 — 모델 클로즈업과 쇼핑엔티 로고",
    /* 자막 없는 두 컷(안경 클로즈업 · 소파)을 맨 앞에 둔다 — 모달을 열자마자
       보이는 자리라, 글자가 얹히지 않은 장면이 먼저 서야 그림이 읽힌다. */
    shots: [
      {
        src: "/images/work/shoppingnt/shoppingnt-glasses.jpg",
        alt: "쇼핑엔티 캠페인 영상 — 안경을 고쳐 쓰며 카메라를 바라보는 모델 클로즈업",
      },
      {
        src: "/images/work/shoppingnt/shoppingnt-sofa.jpg",
        alt: "쇼핑엔티 캠페인 영상 — 거실 소파에 앉아 휴대폰을 보며 웃는 모델",
      },
      {
        src: "/images/work/shoppingnt/shoppingnt-01.jpg",
        alt: '쇼핑엔티 캠페인 영상 — 벽돌 건물 앞에 선 모델, "스타일 티나게" 자막',
      },
      {
        src: "/images/work/shoppingnt/shoppingnt-02.jpg",
        alt: "쇼핑엔티 캠페인 영상 — 앱 구매 고객 적립금 이벤트 화면과 함께 선 모델",
      },
      {
        src: "/images/work/shoppingnt/shoppingnt-03.jpg",
        alt: '쇼핑엔티 캠페인 영상 — 택배 상자를 들고 문을 나서는 모델, "쇼핑은 티나게" 자막',
      },
    ],
  },
  {
    id: "antinol",
    client: "안티놀 래피드",
    title: "설채현이 선택한 안티놀 래피드",
    role: "브랜드 캠페인 영상",
    thumb: "/images/work/antinol/antinol-thumb.jpg",
    thumbAlt:
      '안티놀 래피드 캠페인 영상 — 스튜디오 세트에 앉은 수의사와 반려견, "안티놀 래피드!" 자막',
    shots: [
      {
        src: "/images/work/antinol/antinol-package.jpg",
        alt: '안티놀 래피드 캠페인 영상 — 제품 패키지 클로즈업과 "전 세계 동물병원에서 수의사가 처방하는" 자막',
      },
      {
        src: "/images/work/antinol/antinol-research.jpg",
        alt: '안티놀 래피드 캠페인 영상 — 클립보드를 든 수의사 측면과 "1997년부터 총 87편의 논문 발표, 다양한 연구 논문분야" 자막',
      },
      {
        src: "/images/work/antinol/antinol-01.jpg",
        alt: "안티놀 래피드 캠페인 영상 — 관절/피부/심혈관 연구 수치가 적힌 클립보드를 살펴보는 장면",
      },
      {
        src: "/images/work/antinol/antinol-02.jpg",
        alt: '안티놀 래피드 캠페인 영상 — 반려견을 안고 앉은 수의사, "91종 이상의 천연성분이 캡슐 하나에" 자막',
      },
      {
        src: "/images/work/antinol/antinol-03.jpg",
        alt: '안티놀 래피드 캠페인 영상 — 수의사 클로즈업과 "설채현이 선택한 안티놀 래피드" 자막',
      },
    ],
  },
  {
    id: "s10-maxv-ultra",
    /* 넘겨받은 컷에는 제품명만 찍혀 있었고, 광고주가 로보락으로 확인돼
       브랜드명을 앞에 세웠다. */
    client: "로보락 S10 MaxV Ultra",
    title: "둘이라서 가능한 완벽한 조합",
    role: "브랜드 캠페인 영상",
    thumb: "/images/work/s10-maxv-ultra/s10-thumb.jpg",
    thumbAlt:
      'S10 MaxV Ultra 캠페인 영상 — 로봇청소기와 무선청소기를 두고 선 두 사람, "둘이라서 가능한 완벽한 조합" 자막',
    /* 이야기가 시작되는 밤 거실 컷(s10-03)을 맨 앞에 세우고, 침실 두 컷을
       그 뒤에 붙인다 — 두 사람이 티격태격하는 대목이 먼저 와야 뒤의 제품
       설명 컷(01/02)이 그 답으로 읽힌다. */
    shots: [
      {
        src: "/images/work/s10-maxv-ultra/s10-03.jpg",
        alt: 'S10 MaxV Ultra 캠페인 영상 — 밤 거실에서 대화하는 두 사람, "너 이거 카펫은 어쩌려고!" 자막',
      },
      {
        src: "/images/work/s10-maxv-ultra/s10-turn.jpg",
        alt: 'S10 MaxV Ultra 캠페인 영상 — 침실에서 무선청소기를 건네는 두 사람, "네 차례잖아~" 자막',
      },
      {
        src: "/images/work/s10-maxv-ultra/s10-combo.jpg",
        alt: 'S10 MaxV Ultra 캠페인 영상 — 침실에서 청소기를 주고받는 두 사람, "이 조합, 이대로 괜찮을까?" 자막',
      },
      {
        src: "/images/work/s10-maxv-ultra/s10-01.jpg",
        alt: 'S10 MaxV Ultra 캠페인 영상 — 바닥 얼룩을 닦으며 지나가는 로봇청소기, "강화된 압력으로 어떤 얼룩도 남김없이" 자막',
      },
      {
        src: "/images/work/s10-maxv-ultra/s10-02.jpg",
        alt: 'S10 MaxV Ultra 캠페인 영상 — 주방과 거실에서 각자 청소하는 두 사람, "둘이라서 가능한 완벽한 조합" 자막',
      },
    ],
  },
  {
    id: "shinhan",
    client: "신한투자증권",
    /* 프로그램 이름은 마지막 타이틀 컷(shinhan-05)에 찍힌 그대로다. */
    title: "하룻밤 소개팅",
    role: "브랜디드 콘텐츠 영상",
    thumb: "/images/work/shinhan/shinhan-thumb.jpg",
    thumbAlt:
      '신한투자증권 브랜디드 콘텐츠 — 촬영 장소인 주택의 정원 전경과 "Presented by 신한투자증권" 자막',
    shots: [
      {
        src: "/images/work/shinhan/shinhan-01.jpg",
        alt: "신한투자증권 브랜디드 콘텐츠 — 식탁에 마주 앉아 대화하는 두 출연자",
      },
      {
        src: "/images/work/shinhan/shinhan-02.jpg",
        alt: "신한투자증권 브랜디드 콘텐츠 — 거실에서 웃으며 이야기하는 출연자 클로즈업",
      },
      {
        src: "/images/work/shinhan/shinhan-03.jpg",
        alt: '신한투자증권 브랜디드 콘텐츠 — 테라스에서 내려다본 마을 풍경과 "1:1 데이트 종료, 처음으로 마주하는 네 사람" 자막',
      },
      {
        src: "/images/work/shinhan/shinhan-04.jpg",
        alt: "신한투자증권 브랜디드 콘텐츠 — 침실에서 인터뷰하는 출연자",
      },
      {
        src: "/images/work/shinhan/shinhan-05.jpg",
        alt: '신한투자증권 브랜디드 콘텐츠 — 프로그램 타이틀 "하룻밤 소개팅, 누구에게 투자할까요"',
      },
    ],
  },
  {
    id: "huggies",
    client: "유한킴벌리 하기스",
    title: "그린플레이",
    role: "브랜드 캠페인 영상",
    thumb: "/images/work/huggies/huggies-thumb.jpg",
    thumbAlt:
      '하기스 그린플레이 캠페인 영상 — 텐트 앞에 앉은 엄마와 아기, 숲 놀이 사진과 습관보드가 함께 걸린 화면, "지금부터 시작하자" 자막',
    shots: [
      {
        src: "/images/work/huggies/huggies-bunny.jpg",
        alt: "하기스 그린플레이 캠페인 영상 — 나비와 토끼를 바라보는 아기",
      },
      {
        src: "/images/work/huggies/huggies-nature.jpg",
        alt: '하기스 그린플레이 캠페인 영상 — 나뭇잎 머리띠를 쓰고 노는 아이, "자연을 사랑하는 마음을 키워주자" 자막',
      },
      {
        src: "/images/work/huggies/huggies-play.jpg",
        alt: '하기스 그린플레이 캠페인 영상 — 거실에서 아기와 인형놀이를 하는 엄마, "우리의 모든 것을 따라하는 아기에겐" 자막',
      },
      {
        src: "/images/work/huggies/huggies-board.jpg",
        alt: "하기스 그린플레이 캠페인 영상 — 벽에 붙인 그린플레이 습관보드와 실천 스티커",
      },
      {
        src: "/images/work/huggies/huggies-together.jpg",
        alt: '하기스 그린플레이 캠페인 영상 — 거실 소파에서 함께 있는 엄마와 두 아이, "함께라면 어렵지 않은" 자막',
      },
    ],
  },
  {
    id: "lg-uplus",
    client: "LG U+",
    title: "듀얼넘버 ON/OFF",
    role: "브랜드 캠페인 영상",
    thumb: "/images/work/lg-uplus/lgu-thumb.jpg",
    thumbAlt:
      '듀얼넘버 캠페인 영상 — 카메라를 바라보는 인물과 "택배 운송장에는 듀얼넘버 OFF" 자막',
    shots: [
      {
        src: "/images/work/lg-uplus/lgu-monday.jpg",
        alt: '듀얼넘버 캠페인 영상 — 이른 아침 택배 상자를 안고 나서는 인물, "06:40 AM MONDAY" 자막',
      },
      {
        src: "/images/work/lg-uplus/lgu-onoff.jpg",
        alt: '듀얼넘버 캠페인 영상 — 계단을 오르며 휴대폰을 보는 인물과 "듀얼넘버 ON OFF" 로고',
      },
      {
        src: "/images/work/lg-uplus/lgu-sunday.jpg",
        alt: '듀얼넘버 캠페인 영상 — 휴대폰을 밀어 두는 손과 휴일을 보내는 인물을 나란히 놓은 화면, "14:00 SUNDAY" 자막',
      },
      {
        src: "/images/work/lg-uplus/lgu-weekend.jpg",
        alt: '듀얼넘버 캠페인 영상 — 헤드폰을 낀 인물 클로즈업과 "주말에도 계속되는 업무연락, 좀 쉬자구요" 자막',
      },
      {
        src: "/images/work/lg-uplus/lgu-triptych.jpg",
        alt: '듀얼넘버 캠페인 영상 — 세 인물의 장면을 가로로 나눠 붙인 화면과 "번호 하나로 부족하시죠?" 자막',
      },
    ],
  },
  {
    id: "titleist",
    /* 브랜드는 컷 안의 모자/깃발/캐디백에 찍힌 타이틀리스트를 따랐다.
       제목은 마지막 타이틀 컷(titleist-05)에 손글씨로 적힌 그대로다. */
    client: "타이틀리스트",
    title: "웨지 로프트 갭 선택 방법은?",
    role: "브랜디드 콘텐츠 영상",
    thumb: "/images/work/titleist/titleist-thumb.jpg",
    thumbAlt:
      "타이틀리스트 브랜디드 콘텐츠 — 이시우 프로 소개 자막이 얹힌 필드 인터뷰 화면",
    shots: [
      {
        src: "/images/work/titleist/titleist-01.jpg",
        alt: '타이틀리스트 브랜디드 콘텐츠 — 웨지를 살펴보며 이야기하는 두 사람, "미들 바운스와 하이 바운스의 차이를 느껴 보시죠" 자막',
      },
      {
        src: "/images/work/titleist/titleist-02.jpg",
        alt: '타이틀리스트 브랜디드 콘텐츠 — 필드에서 웨지 샷을 마친 뒷모습, "100m : SM9 50도 12 바운스 F 그라인드" 자막',
      },
      {
        src: "/images/work/titleist/titleist-03.jpg",
        alt: "타이틀리스트 브랜디드 콘텐츠 — 그린을 앞에 두고 어프로치를 준비하는 장면",
      },
      {
        src: "/images/work/titleist/titleist-04.jpg",
        alt: '타이틀리스트 브랜디드 콘텐츠 — 필드 인터뷰 장면, "잔디에 나와가지고 이렇게 직접 테스트를 해보니까" 자막',
      },
      {
        src: "/images/work/titleist/titleist-05.jpg",
        alt: '타이틀리스트 브랜디드 콘텐츠 — "웨지 로프트 갭 선택 방법은?" 손글씨 타이틀이 얹힌 인물 컷',
      },
    ],
  },
  {
    id: "ping-g430",
    client: "PING",
    title: "핑 G430 챌린지",
    role: "브랜디드 콘텐츠 영상",
    thumb: "/images/work/ping-g430/ping-thumb.jpg",
    thumbAlt: "핑 G430 챌린지 타이틀 화면",
    shots: [
      {
        src: "/images/work/ping-g430/ping-driver.jpg",
        alt: 'G430 드라이버 헤드 클로즈업과 "비거리, 관용성 UP" 자막',
      },
      {
        src: "/images/work/ping-g430/ping-hosts.jpg",
        alt: "핑 G430 챌린지 — 진행자 두 사람이 규칙을 설명하는 장면",
      },
      {
        src: "/images/work/ping-g430/ping-lineup.jpg",
        alt: "핑 G430 챌린지 — 양 팀 출전 선수를 소개하는 화면",
      },
      {
        src: "/images/work/ping-g430/ping-longest.jpg",
        alt: '핑 G430 챌린지 — 출연진이 모두 앉은 스튜디오, "첫 번째 대결! 롱기스트 챌린지" 자막',
      },
      {
        src: "/images/work/ping-g430/ping-event.jpg",
        alt: "핑 G430 챌린지 — 시청자 이벤트를 안내하며 박수치는 출연진",
      },
    ],
  },
  {
    id: "beanpole-golf",
    client: "빈폴골프",
    title: "박성현 프로 일일 캐디 되다",
    role: "브랜디드 콘텐츠 영상",
    thumb: "/images/work/beanpole-golf/beanpole-thumb.jpg",
    thumbAlt:
      '빈폴골프 브랜디드 콘텐츠 — 스크린골프 스윙 장면과 코스 화면을 나란히 놓은 "Hole 1 / Par 5" 화면',
    shots: [
      {
        src: "/images/work/beanpole-golf/beanpole-title.jpg",
        alt: '빈폴골프 브랜디드 콘텐츠 타이틀 — "박성현 프로 일일 캐디 되다! feat. 스크린골프 with. 빈폴골프"',
      },
      {
        src: "/images/work/beanpole-golf/beanpole-intro.jpg",
        alt: '빈폴골프 브랜디드 콘텐츠 — 소파에 앉아 이야기하는 출연자와 "박성현 선수가 일일 캐디가 되어 소중한 노하우를 전수!" 자막',
      },
      {
        src: "/images/work/beanpole-golf/beanpole-hole1.jpg",
        alt: '빈폴골프 브랜디드 콘텐츠 — 어프로치 자세와 코스 화면을 나란히 놓은 "Hole 1 / Par 5" 장면',
      },
      {
        src: "/images/work/beanpole-golf/beanpole-lesson.jpg",
        alt: '빈폴골프 브랜디드 콘텐츠 — 스윙을 교정해 주는 장면과 "스윙 속도가 감속됐기 때문에 뒷땅을 치게 된다!" 자막',
      },
      {
        src: "/images/work/beanpole-golf/beanpole-outro.jpg",
        alt: '빈폴골프 브랜디드 콘텐츠 — 손을 흔드는 두 출연자와 "곧 이어, 2부 예고편이 나옵니다!" 자막',
      },
    ],
  },
  {
    id: "footjoy",
    client: "FootJoy",
    title: "FJ INVITATIONAL Pro-Am",
    role: "브랜드 이벤트 영상",
    thumb: "/images/work/footjoy/footjoy-thumb.jpg",
    thumbAlt: "FJ INVITATIONAL Pro-Am 타이틀 화면",
    shots: [
      {
        src: "/images/work/footjoy/footjoy-players.jpg",
        alt: "FJ INVITATIONAL — 대회장에 선 참가자 두 사람",
      },
      {
        src: "/images/work/footjoy/footjoy-ongreen.jpg",
        alt: '"그린을 노려라" 이벤트홀 — 룰렛 앞에서 티샷을 준비하는 참가자',
      },
      {
        src: "/images/work/footjoy/footjoy-fairway.jpg",
        alt: '"페어웨이를 지켜라" 이벤트홀 — 티샷하는 참가자',
      },
      {
        src: "/images/work/footjoy/footjoy-dinner.jpg",
        alt: "FJ INVITATIONAL — 코스 옆 야외 만찬장을 위에서 내려다본 전경",
      },
      {
        src: "/images/work/footjoy/footjoy-interview.jpg",
        alt: 'FJ INVITATIONAL — 캠코더 화면 연출로 담은 참가자 인터뷰, "안녕~!" 자막',
      },
    ],
  },
  {
    id: "huayanxing",
    /* 행사 이름은 무대 화면에 찍힌 그대로 — 국문 "화연싱", 한자 "花颜行",
       영문 "Huayanxing K-Beauty Intelligence Summit". 국문 표기를 쓴다. */
    client: "화연싱",
    title: "제1회 K뷰티 인텔리전스 서밋",
    role: "행사 스케치 영상",
    thumb: "/images/work/huayanxing/huayanxing-thumb.jpg",
    thumbAlt:
      "화연싱 K뷰티 인텔리전스 서밋 — 분홍 무대 화면 앞에서 발표하는 연사와 객석",
    shots: [
      {
        src: "/images/work/huayanxing/huayanxing-01.jpg",
        alt: "화연싱 K뷰티 인텔리전스 서밋 — 분홍 무대 배경 앞에서 인터뷰하는 연사 클로즈업",
      },
      {
        src: "/images/work/huayanxing/huayanxing-02.jpg",
        alt: "화연싱 K뷰티 인텔리전스 서밋 — 목걸이 명찰을 건 참가자들이 앉아 있는 객석",
      },
      {
        src: "/images/work/huayanxing/huayanxing-03.jpg",
        alt: '화연싱 K뷰티 인텔리전스 서밋 — 연단에 선 진행자와 "VISION 제1회 화연싱 K뷰티 인텔리전스 서밋" 무대 화면',
      },
      {
        src: "/images/work/huayanxing/huayanxing-04.jpg",
        alt: '화연싱 K뷰티 인텔리전스 서밋 — 무대 위 발표자와 "지금 탄 분들만 모시고 로켓은 떠납니다" 화면 문구',
      },
      {
        src: "/images/work/huayanxing/huayanxing-05.jpg",
        alt: "화연싱 K뷰티 인텔리전스 서밋 — 중국 앱 화면 세 장을 띄운 무대와 객석 전경",
      },
    ],
  },
  {
    id: "tiktok-pool-party",
    client: "TikTok",
    title: "Creator Summer Pool Party",
    role: "브랜드 이벤트 영상",
    thumb: "/images/work/tiktok-pool-party/tiktok-thumb.jpg",
    thumbAlt:
      'Creator Summer Pool Party 타이틀 화면 — 물결 배경 위 로고와 "내 방식대로, 재밌게" 슬로건',
    shots: [
      {
        src: "/images/work/tiktok-pool-party/tiktok-venue.jpg",
        alt: "Creator Summer Pool Party — 행사장 건물 외관에 얹은 타이틀",
      },
      {
        src: "/images/work/tiktok-pool-party/tiktok-session.jpg",
        alt: "Creator Summer Pool Party — 둘러앉은 참가자들 가운데서 게임을 이끄는 진행자",
      },
      {
        src: "/images/work/tiktok-pool-party/tiktok-stage.jpg",
        alt: "Creator Summer Pool Party — 야외 무대에서 공연하는 출연자들",
      },
      {
        src: "/images/work/tiktok-pool-party/tiktok-watergun.jpg",
        alt: "Creator Summer Pool Party — 물총 게임을 즐기는 참가자들",
      },
      {
        src: "/images/work/tiktok-pool-party/tiktok-pool.jpg",
        alt: "Creator Summer Pool Party — 조명이 켜진 수영장과 대형 TikTok 조형물",
      },
    ],
  },
  {
    id: "pxg-hearing",
    client: "PXG",
    title: "PXG 청문회",
    role: "브랜디드 콘텐츠 영상",
    thumb: "/images/work/pxg-hearing/pxg-thumb.jpg",
    thumbAlt: "PXG 청문회 타이틀 화면",
    shots: [
      {
        src: "/images/work/pxg-hearing/pxg-panel.jpg",
        alt: "PXG 청문회 — 청문회 형식으로 마주 앉은 출연진과 진행자",
      },
      {
        src: "/images/work/pxg-hearing/pxg-guests.jpg",
        alt: 'PXG 청문회 — 마이크 앞에서 이야기하는 출연자 두 사람, "역시 기자님이네~" 자막',
      },
      {
        src: "/images/work/pxg-hearing/pxg-speakers.jpg",
        alt: "PXG 청문회 — PXG 로고 벽 앞에 나란히 앉아 답하는 출연자 세 사람",
      },
      {
        src: "/images/work/pxg-hearing/pxg-laugh.jpg",
        alt: "PXG 청문회 — 웃음이 터진 청문회장 전경",
      },
      {
        src: "/images/work/pxg-hearing/pxg-ball.jpg",
        alt: 'PXG 청문회 — 티에 올린 골프공 클로즈업과 "PXG HAS THE ONE BALL" 자막',
      },
    ],
  },
] as const;

/**
 * 홈페이지 제작 작업물. 지금은 어느 지면에도 걸려 있지 않다 — WORK 의
 * "홈페이지" 갈래를 걷어내며(components/work-projects.tsx) 갈 곳을 잃었다.
 * 지우지 않고 세워 두는 건 컷이 실물이라서다. 갈래가 다시 서면 그대로
 * 꽂으면 된다.
 *
 * 생김새는 workProjects 와 같다(썸네일 한 장 + 모달에 이어 붙는 컷들). 다만
 * 컷이 영상 프레임이 아니라 지면 캡처(1920×880 안팎)라 세로가 길다 — 다시
 * 쓸 때는 모달 상자 비율을 갈래에 맞춰 따로 줘야 한다.
 */
export const workSites = [
  {
    id: "monocus",
    client: "모노커스",
    title: "프리미엄 커스텀 소파 브랜드 사이트",
    role: "홈페이지 제작",
    thumb: "/images/work/monocus/monocus-thumb.jpg",
    thumbAlt:
      "모노커스 홈페이지 — 창밖 호수가 보이는 거실에 놓인 검정 소파와 브랜드 로고가 얹힌 첫 화면",
    shots: [
      {
        src: "/images/work/monocus/monocus-01.jpg",
        alt: "모노커스 홈페이지 — 시그니처 소파를 가로로 넘겨 보는 제품 슬라이더",
      },
      {
        src: "/images/work/monocus/monocus-02.jpg",
        alt: '모노커스 홈페이지 — "Made for your space, Shaped by your taste." 브랜드 소개 지면',
      },
      {
        src: "/images/work/monocus/monocus-03.jpg",
        alt: '모노커스 홈페이지 — "일상이 머무는 자리에 깊은 편안함을" 브랜드 스토리 배너',
      },
    ],
  },
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
  /* photo — WORK 마케팅 갈래의 격자에서 로고 뒤에 까는 컷이다
     (components/work-projects.tsx). 그 칸만 흰 판이 어두운 판으로 뒤집히고,
     컷 위에 스크림이 덮이고, 로고가 흰색으로 뒤집혀 그 위에 얹힌다.
     홈 마퀴는 이 값을 보지 않고 언제나 src 의 로고를 쓴다.

     컷은 가로세로 2:1 안팎이면 잘리는 데 없이 들어간다. 배경은 있어도
     없어도 된다 — 어두운 판 위에 얹히므로 투명하면 판이 비쳐 보인다.

     로고는 흰색으로 뒤집히는 게 기본이다. 대부분이 어두운 잉크 + 투명
     배경이라 그래야 어두운 컷 위에서 보인다.

     색 면이 채워진 로고는 갈린다. 씰리의 파란 나비 도형처럼 글자가 면에서
     뚫려 있으면 뒤집는 편이 낫다 — 흰 배지에 글자가 구멍으로 남아 오히려
     또렷하다. 반대로 우다다의 여우 얼굴처럼 면 안에 눈코가 그려진 그림은
     뒤집으면 그 선까지 다 희어져 덩어리만 남는다. 그런 로고만
     keepLogoColor 로 원색을 지킨다. */
  {
    name: "Hennessy",
    src: "/images/clients/hennessy.png",
    photo: "/images/clients/hennessy-shot.webp",
    photoAlt: "헤네시 코냑 제품군 — 파라디·XO·VSOP·VS·블랙 등 병 여덟 종",
  },
  {
    name: "깐부치킨",
    src: "/images/clients/kkanbu-chicken.png",
    photo: "/images/clients/kkanbu-chicken-shot.webp",
    photoAlt:
      "깐부치킨 — 돌 상판 위 나무 도마에 담긴 후라이드 치킨과 구운 레몬",
  },
  {
    name: "AXA",
    src: "/images/clients/axa.png",
    photo: "/images/clients/axa-shot.webp",
    photoAlt: "AXA 사옥 — 아래에서 올려다본 유리와 석재 외벽 건물",
  },
  {
    name: "고향의봄",
    src: "/images/clients/hometown-spring.png",
    photo: "/images/clients/hometown-spring-shot.webp",
    photoAlt: "고향의봄 베이커리 카페 — 통유리 외벽과 주황 차양이 있는 매장 앞면",
  },
  {
    name: "Bentley",
    src: "/images/clients/bentley.png",
    photo: "/images/clients/bentley-shot.webp",
    photoAlt: "벤틀리 벤테이가 스피드 — 고속도로를 달리는 샴페인색 SUV",
  },
  {
    name: "웅진",
    src: "/images/clients/woongjin.png",
    photo: "/images/clients/woongjin-shot.webp",
    photoAlt: "웅진 사옥 — 창마다 불이 켜진 밤의 오피스 빌딩",
  },
  {
    name: "THE HANOI FOOT&BODY",
    src: "/images/clients/the-hanoi-foot-body.png",
    photo: "/images/clients/the-hanoi-foot-body-shot.webp",
    photoAlt: "더하노이 풋앤바디 매장 — 라탄 조명이 걸린 대기 벤치와 세족대",
    /* 흰색으로 뒤집지 않는다 — 브랜드 이름이 갈색 원판 안에 흰 글자로
       뚫려 있어서, 뒤집으면 판과 글자가 한 덩어리 흰 원이 된다. */
    keepLogoColor: true,
  },
  {
    name: "KB국민카드",
    src: "/images/clients/kb-card.png",
    photo: "/images/clients/kb-card-shot.webp",
    photoAlt: "KB국민카드 ALL 카드 — 노란 띠와 큰 ALL 레터링이 든 카드 앞면",
  },
  {
    name: "Sealy",
    src: "/images/clients/sealy.png",
    photo: "/images/clients/sealy-shot.webp",
    photoAlt: "씰리 침대 — 펜던트 조명이 걸린 침실에 놓인 매트리스와 헤드보드",
  },
  {
    name: "SOOP",
    src: "/images/clients/soop.png",
    photo: "/images/clients/soop-shot.webp",
    photoAlt: "SOOP 사옥 — 옥상에 SOOP 사인이 올라간 유리 외벽 건물",
  },
  {
    name: "우다다",
    src: "/images/clients/udada.png",
    photo: "/images/clients/udada-shot.webp",
    photoAlt: "우다다 매장 앞면 — 강아지 그림이 붙은 유리문과 창",
    /* 흰색으로 뒤집지 않는다 — 면으로 그린 여우 얼굴이라 뒤집으면 눈코가
       사라지고 흰 덩어리만 남는다. 컷이 밝은 편이라 원색으로도 읽힌다. */
    keepLogoColor: true,
  },
  {
    name: "메리츠화재",
    src: "/images/clients/meritz-fire.png",
    photo: "/images/clients/meritz-fire-shot.webp",
    photoAlt: "메리츠타워 — 아래에서 올려다본 유리 외벽 고층 건물",
  },
  {
    name: "The Balvenie",
    src: "/images/clients/the-balvenie.png",
    photo: "/images/clients/the-balvenie-shot.webp",
    photoAlt:
      "발베니 싱글 몰트 위스키 — 나무 탁자에 늘어선 더블우드 12년/캐리비언 캐스크 14년/더블우드 17년/포트우드 21년 병 넷",
  },
  {
    name: "직폰",
    src: "/images/clients/ziphone.png",
    photo: "/images/clients/ziphone-shot.webp",
    photoAlt: "직폰 — 색깔별로 늘어선 아이폰 뒷면 넷",
  },
  {
    name: "아모레퍼시픽",
    src: "/images/clients/amorepacific.png",
    photo: "/images/clients/amorepacific-shot.webp",
    photoAlt: "아모레퍼시픽 본사 — 밤에 빛나는 정육면체 유리 사옥",
  },
  {
    name: "MONOCUS",
    src: "/images/clients/monocus.png",
    photo: "/images/clients/monocus-shot.webp",
    photoAlt: "모노커스 소파 — 볕 드는 거실에 놓인 브라운 가죽 코너 소파",
  },
  {
    name: "Rolls-Royce",
    src: "/images/clients/rolls-royce.png",
    photo: "/images/clients/rolls-royce-shot.webp",
    photoAlt: "롤스로이스 팬텀 — 스튜디오 배경에 선 세이지 그린 세단",
  },
  {
    name: "린선다이닝",
    src: "/images/clients/linsen-dining.png",
    photo: "/images/clients/linsen-dining-shot.webp",
    photoAlt: "린선다이닝 — 대나무 무늬 조명 패널이 둘린 유리 매장 앞면",
  },
  {
    name: "하이투자증권",
    src: "/images/clients/dgb-hi-investment.png",
    photo: "/images/clients/dgb-hi-investment-shot.webp",
    photoAlt: "하이투자증권 사옥 — 아래에서 올려다본 곡면 유리 타워",
  },
  {
    name: "Care by Me",
    src: "/images/clients/care-by-me.png",
    photo: "/images/clients/care-by-me-shot.webp",
    photoAlt: "케어바이미 매장 — 아치 벽감과 원형 간접등이 놓인 흰 대기실",
  },
  {
    name: "NS홈쇼핑",
    src: "/images/clients/ns-homeshopping.png",
    photo: "/images/clients/ns-homeshopping-shot.webp",
    photoAlt: "NS홈쇼핑 사옥 — 유리와 색 패널이 섞인 외벽",
  },
  {
    name: "dr ROBBIN",
    src: "/images/clients/dr-robbin.png",
    photo: "/images/clients/dr-robbin-shot.webp",
    photoAlt: "닥터로빈 매장 앞면 — 아치 창이 늘어선 유리 파사드와 자동문",
  },
  {
    name: "라이나생명",
    src: "/images/clients/lina-life.png",
    photo: "/images/clients/lina-life-shot.webp",
    photoAlt: "라이나생명 사옥 — 해 질 녘 불이 들어온 유리 외벽 모서리",
  },
  {
    name: "웨이브히어링",
    src: "/images/clients/wave-hearing.png",
    photo: "/images/clients/wave-hearing-shot.webp",
    photoAlt: "웨이브히어링 보청기 — 귀에 거는 고리가 달린 검은 본체",
  },
  {
    name: "Porsche",
    src: "/images/clients/porsche.png",
    photo: "/images/clients/porsche-shot.webp",
    photoAlt: "포르쉐 파나메라 — 바닷가 도로를 달리는 오렌지색 세단",
  },
  {
    name: "우피아",
    src: "/images/clients/uffia.png",
    photo: "/images/clients/uffia-shot.webp",
    photoAlt: "우피아 가구 — 선반 시스템과 원목 식탁이 놓인 밝은 거실",
  },
  {
    name: "TV조선",
    src: "/images/clients/tv-chosun.png",
    photo: "/images/clients/tv-chosun-shot.webp",
    photoAlt: "TV조선 사옥 — 해 질 녘 세로 결이 새겨진 외벽과 불 켜진 창",
  },
  {
    name: "살롱드하루",
    src: "/images/clients/salon-de-haru.png",
    photo: "/images/clients/salon-de-haru-shot.webp",
    photoAlt: "살롱드하루 매장 앞면 — 원목 틀에 든 유리 파사드와 이발소 사인",
  },
  {
    name: "삼성카드",
    src: "/images/clients/samsung-card.png",
    photo: "/images/clients/samsung-card-shot.webp",
    photoAlt: "삼성카드 — 파란 바탕에 비스듬히 늘어놓은 카드 여러 장",
  },
  {
    name: "아이품고",
    src: "/images/clients/ipoomgo.png",
    photo: "/images/clients/ipoomgo-shot.webp",
    photoAlt: "아이품고 광고 한 장면 — 휴대폰을 든 채 웃는 여성의 얼굴",
  },
  {
    name: "한화손해보험",
    src: "/images/clients/hanwha-insurance.png",
    photo: "/images/clients/hanwha-insurance-shot.webp",
    photoAlt: "한화손해보험 사옥 — 맑은 하늘 아래 파란 유리 외벽 고층 건물",
  },
  {
    name: "BODYBEAN PILATES",
    src: "/images/clients/bodybean-pilates.png",
    photo: "/images/clients/bodybean-pilates-shot.webp",
    photoAlt: "바디빈필라테스 — 통유리 앞 리포머 위에서 동작 중인 회원",
  },
  {
    name: "코인원",
    src: "/images/clients/coinone.png",
    photo: "/images/clients/coinone-shot.webp",
    photoAlt: "코인원 앱 화면 — 시세/잔고/주문 화면이 나란히 선 휴대폰 셋",
  },
  {
    name: "ALLERMAN",
    src: "/images/clients/allerman.png",
    photo: "/images/clients/allerman-shot.webp",
    photoAlt: "알레르망 침구 — 몰딩 벽 앞 침대에 덮인 아이보리 이불과 베개",
  },
  {
    name: "SK브로드밴드",
    src: "/images/clients/sk-broadband.png",
    photo: "/images/clients/sk-broadband-shot.webp",
    photoAlt: "SK브로드밴드 사옥 — 맑은 하늘 아래 흰 외벽 고층 건물",
  },
  {
    name: "오키파",
    src: "/images/clients/okipa.png",
    photo: "/images/clients/okipa-shot.webp",
    photoAlt: "옆커폰 매장 앞면 — 유리문 안에 세워 둔 신제품 예약 안내판",
  },
  {
    name: "미래에셋증권",
    src: "/images/clients/mirae-asset.png",
    photo: "/images/clients/mirae-asset-shot.webp",
    photoAlt: "미래에셋 센터원 — 유리 타워 아래 광장과 캐노피",
  },
  {
    name: "SHINE U CLINIC",
    src: "/images/clients/shine-u-clinic.png",
    photo: "/images/clients/shine-u-clinic-shot.webp",
    photoAlt: "샤인유클리닉 — 빛나는 리셉션 데스크가 놓인 흰 로비",
  },
  {
    name: "현대해상",
    src: "/images/clients/hyundai-insurance.png",
    photo: "/images/clients/hyundai-insurance-shot.webp",
    photoAlt: "현대해상 사옥 — 파란 하늘 아래 격자 무늬 유리 외벽 건물",
  },
  {
    name: "Odorr",
    src: "/images/clients/odorr.png",
    photo: "/images/clients/odorr-shot.webp",
    photoAlt: "오도르 차량용 디퓨저 — 바닷가 러그 위에 놓인 흰 패키지",
  },
  {
    name: "한국경제TV",
    src: "/images/clients/hankyung-tv.png",
    photo: "/images/clients/hankyung-tv-shot.webp",
    photoAlt: "한국경제 사옥 — 유리 원통형 타워와 맞붙은 사무동 외벽",
  },
  {
    name: "THE LITER",
    src: "/images/clients/the-liter.png",
    photo: "/images/clients/the-liter-shot.webp",
    photoAlt: "더리터 매장 — 주문대 앞에 줄지어 선 손님들",
  },
  {
    name: "HERMÈS",
    src: "/images/clients/hermes.png",
    photo: "/images/clients/hermes-shot.webp",
    photoAlt: "에르메스 매장 — 유리문을 활짝 연 부티크 앞면과 내부 진열",
  },
  {
    name: "DB손해보험",
    src: "/images/clients/db-insurance.png",
    photo: "/images/clients/db-insurance-shot.webp",
    photoAlt: "DB손해보험 사옥 — 파란 하늘 아래 유리 외벽 고층 건물",
  },
  {
    name: "Hendrick's Gin",
    src: "/images/clients/hendricks-gin.png",
    photo: "/images/clients/hendricks-gin-shot.webp",
    photoAlt: "핸드릭스 진 — 오이를 두른 진토닉 잔과 검은 병, 지거",
  },
  {
    name: "Lillet",
    src: "/images/clients/lillet.png",
    photo: "/images/clients/lillet-shot.webp",
    photoAlt: "릴레 로제 — 카페 테이블에 놓인 병과 탄산수를 따르는 잔",
  },
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

/**
 * 샤오홍슈 병원 마케팅 — 글로벌 마케팅 페이지(/service/global)의 두 번째 묶음.
 *
 * 내용은 제안서("다이버즈_샤오홍슈_병원마케팅_제안서")에서 옮겼다.
 *
 * 가격표와 패키지 구성(월 240~550만원 등)은 옮기지 않았다. 공개 지면에
 * 금액을 박아 두면 병원 상황에 맞춰 조정하던 여지가 먼저 사라지고, 제안서가
 * 개정될 때마다 이 파일이 조용히 틀린 값을 들고 있게 된다. 금액이 필요한
 * 사람은 문의로 오게 두고, 여기서는 무엇을 어떻게 하는지만 말한다.
 */
export const hospitalMarketing = {
  en: "XIAOHONGSHU HOSPITAL MARKETING",
  /**
   * 화면에 나가는 상품 이름. 번호 줄 바로 아래, 후킹 문장 위에 얹는다.
   *
   * "샤오홍슈 병원 마케팅"이 아니라 "중국인 유입"으로 여는 이유는, 이 상품을
   * 찾는 병원이 먼저 떠올리는 말이 채널 이름이 아니라 목적이기 때문이다 —
   * 샤오홍슈는 그 목적을 이루는 수단이고, 바로 아래 문장이 그걸 말한다.
   */
  name: "중국인 유입 병원 마케팅",
  /**
   * 제목 위에 한 줄 얹는 공감 포인트.
   * 이커머스 탭(ecommerceMarketing.hook)과 같은 자리·같은 규격이다 —
   * 두 상품이 탭으로 나란히 서므로 여는 방식이 달라지면 안 된다.
   *
   * 아래 title 이 "왜 안 오는지"를 설명하는 문장이라, 그 앞에서 병원이
   * 실제로 느끼는 막막함을 먼저 받아 준다. 단정하지 않고 "막막하지
   * 않습니다"로 부담만 덜어 낸다 — 근거는 아래 유입 시스템이 댄다.
   */
  hook: "중국인 환자 유치, 막막하지 않습니다.",
  /**
   * 이 묶음의 후킹 포인트. 제안서 2장의 머리를 그대로 쓴다 —
   * "왜 샤오홍슈인가"를 한 문장으로 세우는 자리라, 무엇을 해 준다는 말보다
   * 먼저 와야 한다.
   */
  title:
    "중국 고객은 병원을 바로 예약하지 않습니다.\n먼저 샤오홍슈에서 확인합니다.",
  summary:
    "샤오홍슈에서 검색하고, 후기를 확인하고, 위챗으로 상담한 뒤에 병원을 정합니다. " +
    "샤오홍슈에서 보이지 않는 병원은 중국 고객에게 존재하지 않는 병원과 같습니다. " +
    "다이버즈는 공식 계정 구축부터 콘텐츠 운영, 기자단/체험단 확산, 샤오홍슈 CS까지를 하나의 유입 구조로 묶어 " +
    "병원이 발견되는 순간부터 상담까지 이어지는 경로를 만듭니다.",
  /**
   * 목적별 패키지 셋 + 통합 패키지.
   *
   * 금액을 지면에 적는다. 처음에는 빼 뒀는데, 이 상품을 찾는 병원이 가장 먼저
   * 알고 싶어 하는 것이 "얼마인가"라 물어보기 전에 답하는 편이 낫다는 판단이다.
   * 대신 조건(3개월 기준·VAT 별도·조정 가능)을 금액 옆에서 같이 말한다.
   *
   * 제안서가 개정되면 여기 숫자부터 확인한다 — 화면 쪽에는 금액이 없다.
   */
  packages: {
    title: "목적에 맞춰 고르는 운영 패키지",
    body: "병원의 목표와 단계에 맞춰 세 가지 목적별 패키지로 운영할 수 있습니다.",
    /** 모든 패키지에 공통으로 붙는 단서. 금액 곁을 떠나지 않게 화면에서도 같이 쓴다. */
    note: "모든 패키지는 최소 3개월 계약 기준이며 금액은 VAT 별도입니다.",
    items: [
      {
        name: "계정 운영형 패키지",
        summary: "초기 세팅과 고객 유입을 가장 안정적으로 시작하는 구성",
        includes: [
          "KOS 계정 + 플랫폼 광고 (최소 3개월)",
          "월 15개 콘텐츠 발행",
          "월 5,000위안 플랫폼 광고 포함",
          "퍼포먼스 마케터 운영",
          "평일 9~18시 샤오홍슈 CS",
          "계약 기간 내 무제한 무료 A/S",
        ],
        price: "월 360만원",
        priceNote: "정상가 400만원 / 3개월 총 120만원 할인",
      },
      {
        name: "체험단 패키지",
        summary: "실제 방문 후기와 자연스러운 방문 콘텐츠를 함께 확보하는 구성",
        includes: [
          "1K 이상 체험단 월 10팀",
          "10K 이상 체험단 월 4팀",
          "10K 이상 방문형 기자단 월 4건",
          "콘텐츠 가이드/섭외/업로드 관리 포함",
        ],
        price: "월 240만원",
        priceNote: "체험단/방문형 비율은 병원 상황에 따라 조정",
      },
      {
        name: "왕홍 패키지",
        summary: "영향력 있는 계정으로 단기 노출과 신뢰도를 강화하는 구성",
        includes: [
          "50K 이상 왕홍 월 5팀",
          "100K 이상 왕홍 월 2팀",
          "콘텐츠 가이드/섭외/업로드 관리 포함",
          "기자단은 제외된 구성",
        ],
        price: "월 490만원",
        priceNote: "왕홍 섭외 상황에 따라 일부 조정 가능",
      },
    ],
    /** 통합 패키지 — 제안서가 가장 앞에 미는 구성이라 화면에서도 따로 세운다. */
    bundle: {
      badge: "최우선 추천",
      name: "통합 패키지",
      summary: "계정 운영과 외부 확산을 함께 가져가는 구성",
      price: "월 550만원",
      body:
        "중국 고객 유입 구조를 제대로 만들기 위해 계정 운영과 광고로 유입을 만들고, " +
        "방문형 기자단과 50K 이상 콘텐츠로 외부 신뢰와 검색 노출을 함께 확보합니다.",
      includes: [
        { label: "계정 운영", body: "KOS 계정 + 플랫폼 광고 운영" },
        { label: "콘텐츠 운영", body: "월 15개 콘텐츠 발행" },
        { label: "광고 집행", body: "월 5,000위안 플랫폼 광고 포함" },
        { label: "샤오홍슈 CS", body: "평일 9:00~18:00 기본 CS" },
        { label: "방문형 기자단", body: "10K 이상 방문형 기자단 월 4건" },
        {
          label: "50K 이상 콘텐츠",
          body: "50K 이상 체험단 또는 방문형 월 2건",
        },
        { label: "운영 관리", body: "콘텐츠 가이드/섭외/업로드 관리" },
        { label: "A/S", body: "계약 기간 내 무제한 무료 A/S" },
      ],
      note: "3개월 기준 / VAT 별도. 50K 이상 콘텐츠는 체험단 또는 방문형 중 병원 상황에 맞춰 구성되며, 비율은 시술 항목/소재 보유 여부/운영 목적에 따라 조정할 수 있습니다.",
    },
  },
  points: [
    "공식 계정 구축",
    "월 15개 콘텐츠 운영",
    "샤오홍슈 CS",
    "위챗 상담 연결",
    "기자단/체험단",
    "방문형 기자단",
    "왕홍 콘텐츠",
    "플랫폼 광고",
  ],
  /** 중국 고객이 한국 병원을 고르기까지 — 샤오홍슈 안에서 거치는 다섯 단계. */
  journey: [
    {
      no: "01",
      label: "검색",
      body: "병원명과 지역으로 존재와 인지도를 확인합니다.",
    },
    {
      no: "02",
      label: "후기 확인",
      body: "실제 방문/시술 후기와 평판을 확인합니다.",
    },
    {
      no: "03",
      label: "위치/접근성",
      body: "위치와 방문 동선, 접근성을 확인합니다.",
    },
    {
      no: "04",
      label: "방문 경험",
      body: "방문기/브이로그형 콘텐츠로 분위기를 봅니다.",
    },
    {
      no: "05",
      label: "위챗 상담",
      body: "위챗으로 문의/상담한 뒤 예약을 결정합니다.",
    },
  ],
  /** 공식 계정에서 시작하는 이유 — 제재 리스크와 그에 맞춘 운영 방식. */
  account: {
    title: "일반 계정이 아니라 공식 계정에서 시작합니다",
    body:
      "중국 플랫폼은 한국 의료/미용 콘텐츠 심사를 강화하고 있습니다. 일반 계정으로 운영하면 콘텐츠가 삭제되거나 노출이 " +
      "제한되고, 위챗 상담으로 넘어가는 길목까지 막힐 수 있습니다. 다이버즈는 중국 내 의료/미용 협력 법인의 인증 구조를 " +
      "활용해 병원 마케팅에 맞는 공식 계정을 구축하고, 계약 기간 내내 무제한 무료 A/S로 계정을 지킵니다.",
  },
  /**
   * 계정 운영에서 매달 도는 일 여덟.
   *
   * icon 은 lucide-react 의 이름이다. 화면 쪽에서 이름 → 컴포넌트로 바꿔
   * 쓴다(components/hospital-marketing.tsx) — 데이터 파일이 리액트
   * 컴포넌트를 들고 있으면 서버/클라이언트 경계에서 걸린다.
   */
  operation: {
    title: "단순 대행이 아닌 운영 구조를 기획합니다",
    body:
      "샤오홍슈 마케팅은 콘텐츠를 몇 개 올리는 일이 아니라 운영 구조의 문제입니다. " +
      "다이버즈는 콘텐츠 발행부터 CS와 반응 분석까지 운영 전반을 체계적으로 관리해 " +
      "병원의 실질적인 성장을 돕습니다.",
    items: [
      {
        icon: "CalendarCheck",
        label: "월 콘텐츠 발행",
        body: "월 15개 콘텐츠 정기 발행",
      },
      {
        icon: "Images",
        label: "병원 전달 소재",
        body: "사진/영상/텍스트 소재 활용",
      },
      {
        icon: "Languages",
        label: "소재 재가공",
        body: "중국어 번역 및 톤앤매너 재가공",
      },
      {
        icon: "PenLine",
        label: "콘텐츠 기획",
        body: "분위기/방문 동선/정보성 중심",
      },
      {
        icon: "Settings",
        label: "계정 세팅",
        body: "프로필/소개/위치/카테고리 구성",
      },
      {
        icon: "Headset",
        label: "샤오홍슈 CS",
        body: "평일 9:00~18:00 기본 CS 대응",
      },
      {
        icon: "ChartColumn",
        label: "반응 분석",
        body: "반응 좋은 콘텐츠 유형 분석",
      },
      {
        icon: "RefreshCw",
        label: "무제한 A/S",
        body: "계약 기간 내 무제한 무료 A/S",
      },
    ],
  },
  /**
   * 유입 시스템 아홉 단계 — 계정을 만드는 일부터 예약이 잡히는 순간까지.
   *
   * 위 operation 과 항목이 겹쳐 보이지만 말하는 층이 다르다. operation 은
   * "매달 무엇을 하는가"(나란한 업무), 이쪽은 "그 일들이 어떤 순서로 이어져
   * 예약까지 가는가"(한 줄기 흐름)다. 화면에서도 앞은 카드, 뒤는 어두운 띠
   * 위의 타임라인으로 갈라 놓는다.
   */
  system: {
    title: "계정 구축부터 예약 전환까지,\n전 과정을 다이버즈가 진행합니다",
    body: "개별 운영 업무를 끊김 없이 연결해, 중국 고객이 발견하고 신뢰하고 상담까지 이동하는 경로를 설계합니다.",
    steps: [
      "공식 계정 구축",
      "계정 세팅",
      "월 15개 콘텐츠 운영",
      "인/아웃 인게이지먼트",
      "기자단/체험단 확산",
      "병원 공식 계정 유입",
      "샤오홍슈 CS / 위챗 유입",
      "병원 상담실 상담",
      "예약 전환",
    ],
  },
  /**
   * 외부 콘텐츠 4종 — 계정 밖에서 검색 노출과 후기를 만드는 갈래.
   *
   * 위 system(공식 계정 안에서 도는 일)과 짝이다. 계정은 찾아온 사람에게
   * 신뢰를 주지만, 애초에 검색에 걸리고 남의 후기로 발견되는 일은 계정
   * 바깥에서 일어난다 — 그 바깥을 넷으로 갈라 놓는다.
   *
   * 넷의 격은 같다 — 고르는 선택지가 아니라 함께 도는 갈래라, 지면에서도
   * 한 장을 미리 칠해 두지 않는다(화면 쪽에서 마우스가 얹힌 한 장만
   * 뒤집는다). 방문형 기자단이 왜 특별한지는 아래 visitBased 가 말로 받는다.
   */
  contents: {
    title: "외부 콘텐츠로 검색 노출과 신뢰도를 확보합니다",
    body: "공식 계정이 내부 신뢰를 만든다면, 기자단/체험단/왕홍 콘텐츠는 외부 후기와 검색 노출을 만듭니다.",
    items: [
      {
        name: "기자단",
        body: "병원이 제공한 사진/영상 소재를 인플루언서 계정에 올립니다.",
        effect: "빠른 검색 점유",
        image: {
          src: "/images/service/global/hospital-contents/press-corps.png",
          alt: "손에 든 휴대폰 화면에 병원 내부 사진이 격자로 떠 있고, 그중 몇 장을 골라 올리려는 참",
        },
      },
      {
        name: "체험단",
        body: "시술과 관리를 직접 체험한 뒤 후기 콘텐츠를 올립니다.",
        effect: "실제 방문 후기 확보",
        image: {
          src: "/images/service/global/hospital-contents/experience-group.png",
          alt: "밝은 관리실 의자에 앉은 사람이 휴대폰으로 후기를 남기는 모습",
        },
      },
      {
        name: "방문형 기자단",
        body: "시술 없이 방문 동선/상담 환경/병원 분위기를 담습니다.",
        effect: "의료 제재 리스크 완화",
        image: {
          src: "/images/service/global/hospital-contents/visit-based.png",
          alt: "짐벌에 얹은 카메라가 사람 없는 병원 로비와 상담 공간을 담는 모습",
        },
      },
      {
        name: "왕홍 콘텐츠",
        body: "영향력 있는 계정을 통해 콘텐츠를 넓게 퍼뜨립니다.",
        effect: "단기 노출 강화",
        image: {
          src: "/images/service/global/hospital-contents/wanghong.png",
          alt: "링라이트와 삼각대에 올린 휴대폰으로 라이브 방송을 준비하는 스튜디오 한켠",
        },
      },
    ],
  },
  /** 방문형 기자단을 따로 짚는 한 줄. 의료 광고 제재가 강해진 지금의 답이다. */
  visitBased:
    "특히 방문형 기자단은 시술 장면도, 전후 비교도 없이 병원을 노출합니다. " +
    "고가 시술을 내줄 필요도, 시술실과 예약 시간을 비워 둘 필요도, 노쇼를 감수할 필요도 없습니다.",
} as const;

/**
 * 중국 이커머스 입점 마케팅 — 글로벌 마케팅 페이지(/service/global)의 첫 번째 묶음.
 *
 * 내용은 입점 인프라 파트너사의 소개서(중국·동남아, 2026-03 기준)와
 * 다이버즈 공동 제안서 두 건에서 옮겼다.
 *
 * 이 상품의 구조가 병원 마케팅과 다른 점은 파는 주체가 둘이라는 것이다.
 * 입점 인프라는 파트너사가, 마케팅은 다이버즈가 맡는다. 그래서 화면에서도
 * 두 단계를 나눠 보여 준다 — 그걸 뭉뚱그리면 "다이버즈가 보세창고를
 * 운영한다"처럼 읽혀서, 나중에 파트너가 바뀌면 말이 통째로 틀린다.
 *
 * 파트너사 이름은 화면에 쓰지 않는다. 지면에서는 "입점 인프라 파트너"로만
 * 부르고, 실제 사명은 상담에서 안내한다 — 파트너가 바뀌어도 이 페이지의
 * 문구는 그대로 쓸 수 있어야 한다.
 *
 * 금액과 기간은 모두 제안서 기준이다. 환율·카테고리·플랫폼 정책에 따라
 * 달라지는 값이라 화면에서도 단서(note)를 금액 곁에서 같이 말한다 —
 * 제안서가 개정되면 여기 숫자부터 확인한다.
 */
export const ecommerceMarketing = {
  en: "CHINA COMMERCE",
  /* 이름에 "/"를 넣어 두 영역을 갈라 둔다 — "입점 마케팅"으로 붙여 쓰면
     한 가지 서비스로 읽히는데, 실제로는 입점(파트너)과 마케팅(다이버즈)이
     주체도 단계도 다른 둘이다. 지면도 STAGE 01/02 로 나뉜다. */
  name: "중국 이커머스 입점/마케팅",
  /**
   * 제목 위에 한 줄 얹는 공감 포인트.
   *
   * 제목(title)은 "우리가 무엇을 해 준다"는 공급자의 말이라, 그 앞에
   * 읽는 사람이 이미 품고 있는 생각을 먼저 받아 준다 — 중국 진출을
   * 알아보는 브랜드가 가장 먼저 부딪히는 감정이 "복잡하고 비싸다"라서,
   * 그 부담을 내려놓게 하는 문장으로 연다.
   *
   * 단정(어렵지 않습니다)이 아니라 "생각만큼"을 넣어 과장을 피한다 —
   * 아래 NEEDS·COMPARISON이 근거를 대기 전에 말이 앞서면 안 된다.
   */
  /**
   * 공감 문구 위에 한 줄로 세우는 채널 칩.
   *
   * 이 상품이 실제로 닿는 중국 플랫폼을 이름/로고로 먼저 보여 준다 —
   * "중국 입점"이라는 말이 추상적이라, 어디에 들어가는 것인지가 문장보다
   * 먼저 눈에 들어와야 한다.
   *
   * `src` 가 있으면 로고를, 없으면 이름을 그대로 칩에 담는다. 실제
   * 상표라 없는 로고를 임의로 그려 넣지 않는다 — 넷 다 로고 파일이
   * 들어와서 이제 이름만 나가는 항목은 없다.
   */
  platforms: [
    {
      name: "샤오홍슈",
      src: "/images/service/global/platforms/xiaohongshu.png",
    },
    { name: "더우인", src: "/images/service/global/platforms/tiktok.png" },
    { name: "콰이쇼우", src: "/images/service/global/platforms/kuaishou.png" },
    { name: "타오바오", src: "/images/service/global/platforms/taobao.png" },
  ],
  hook: "중국 진출, 생각만큼 어렵지 않습니다.",
  /**
   * 후킹. "무엇을 하나로 묶어 주는가"를 첫 문장에 바로 세운다 — 아래
   * 개념도(일반 방식 vs 다이버즈 방식)와 NEEDS 카드 여섯 개가 전부 이
   * 한 문장("모든 업무를 하나의 구조로 연결")을 풀어 쓴 것이다.
   * 입점 인프라 파트너의 실제 플랫폼 소개 문구를 그대로 옮기되, 사명은
   * 넣지 않는다(위 주석 참고) — "플랫폼" 대신 이 지면에서 이미 쓰는
   * "판매 구조"로 바꿔 쓴다.
   */
  title: "중국 커머스 진출은\n두 단계로 나뉩니다",
  summary:
    "먼저 판매 가능한 구조를 만들고(STAGE 01), 실제 판매를 만드는 마케팅을 연결합니다(STAGE 02). " +
    "입점 실무는 입점 인프라 파트너가, 마케팅은 다이버즈가 맡습니다. " +
    "두 단계를 한 곳에서 이어 붙여, 브랜드는 제품과 의사결정에만 집중하시면 됩니다.",

  /**
   * 두 단계 소개 — 제안서 p2/p3.
   *
   * 이 지면에서 가장 먼저 잡혀야 하는 게 "누가 무엇을 하는가"다. 예전에는
   * 입점과 마케팅이 한 덩어리로 붙어 있어서, 보세창고 운영까지 다이버즈가
   * 하는 것처럼 읽혔다(파트너가 바뀌면 통째로 틀리는 말이다).
   * 그래서 아래 지면 전체를 STAGE 01 / BRIDGE / STAGE 02 로 가르고,
   * 그 머리에 이 두 장을 먼저 세운다.
   */
  stages: [
    {
      no: "STAGE 01",
      /* 제목이 아래 다섯 줄(입점 → 상품 등록 → 주문/재고 → 물류/통관 →
         정산/CS)을 한 마디로 받는다. "판매 가능한 구조 구축"은 무엇을
         해 주는지가 비어 있어서, 그 다섯 줄을 다 읽어야 뜻이 잡혔다 —
         양 끝(상품관리·CS)과 가운데(물류)를 이름에 올려 두면 목록을
         읽기 전에 범위가 먼저 잡힌다. */
      name: "상품관리부터 물류/CS까지 올인원 서비스",
      owner: "입점 인프라 파트너",
      body: "브랜드샵을 직접 만들지 않고도 중국 주요 플랫폼에 판매 구조를 먼저 세웁니다.",
      items: [
        "중국 플랫폼 입점",
        "상품 등록 / 플랫폼 연동",
        "주문 / 재고 통합 관리",
        "물류 / 보세창고 / 통관",
        "정산 / 현지 CS 지원",
      ],
    },
    {
      no: "STAGE 02",
      name: "실제 판매를 만드는 마케팅",
      owner: "다이버즈",
      body: "중국 소비자가 브랜드를 발견하고 신뢰하고 구매하기까지의 흐름을 설계하고 실행합니다.",
      items: [
        "브랜드 진단 / 중국 마케팅 전략",
        "샤오홍슈 계정 구축 / 콘텐츠 제작",
        "KOC / KOL 인플루언서 시딩",
        "중국 디지털 광고 운영",
        "도우인 라이브커머스 실행",
      ],
    },
  ],

  /** 첫 소구포인트 — "이럴 때 필요하다"를 비용 얘기보다 먼저 세운다. */
  needs: {
    /**
     * "복잡한 실무는 우리가 → 브랜드는 제품에" 역할 분담으로 연다.
     *
     * 이 묶음의 핵심은 결국 다이버즈가 해결한다는 것이다. 그래서 부담을
     * 늘어놓는 대신("생각보다 해야 할 일이 많습니다"는 브랜드에게 숙제를
     * 다시 확인시키는 인상이 났다) 해결 주체를 첫 줄에 바로 세우고,
     * 둘째 줄이 그래서 브랜드에게 남는 자리를 준다. 걱정을 되묻지 않는
     * 것은 그대로다("걱정할 게 너무 많죠?"는 답을 재촉하는 인상이 난다).
     * 본문은 조건("브랜드샵 직접 입점 없이도")만 받고, 아래 카드
     * 여섯 장이 그 "복잡한 실무"가 무엇무엇인지 풀어 쓴 목록으로 읽힌다.
     *
     * 카드 여섯 장도 같은 구조다 — 제목은 브랜드가 실제로 하는 걱정
     * (복잡한 위생허가, 높은 초기 비용 …), 본문은 그 걱정이 어떻게
     * 없어지는지, 태그는 그래서 남는 결과다. 예전에는 카드 제목이
     * 걱정("현지 언어 CS 필요")과 해결("해외 운영 비용 최소화")로 섞여 있어
     * 여섯 장이 무엇의 목록인지 흐렸다.
     */
    title: "복잡한 입점 실무는 맡기세요\n브랜드는 제품에만 집중하세요",
    body: "브랜드샵 직접 입점 없이도, 아래 여섯 가지를 그대로 맡기실 수 있습니다.",
    items: [
      {
        no: "01",
        title: "복잡한 위생허가",
        body: "화장품/건강기능식품처럼 정식 인증에 시간과 비용이 크게 드는 카테고리도, 콰징 구조로 인증 없이 판매 가능한 영역부터 먼저 시작할 수 있습니다.",
        tag: "빠른 런칭",
      },
      {
        no: "02",
        title: "높은 초기 비용",
        body: "브랜드샵 직접 개설에 드는 보증금/연회비/전담 인력 부담 없이, 초기 비용을 크게 줄여 판매 구조부터 만들 수 있습니다.",
        tag: "초기비용 절감",
      },
      {
        no: "03",
        title: "채널마다 따로 입점",
        body: "중국 주요 플랫폼에 처음 진출하더라도, 한 번의 상품 등록으로 여러 채널을 동시에 열 수 있습니다.",
        tag: "멀티채널 동시 런칭",
      },
      {
        no: "04",
        title: "흩어진 주문/재고/정산",
        body: "플랫폼마다 따로 들어가 확인하던 내역을, 하나의 관리자 화면에서 모아 볼 수 있습니다.",
        tag: "통합 관리",
      },
      {
        no: "05",
        title: "물류/통관 리스크",
        body: "국제 물류/보세창고/통관 실무를 자체 인력으로 처음부터 감당하지 않아도 되어, 리스크를 낮출 수 있습니다.",
        tag: "리스크 최소화",
      },
      {
        no: "06",
        title: "현지 언어 CS",
        body: "중국어 응대 인력을 따로 채용하지 않고도 현지 소비자 문의와 클레임에 대응할 수 있습니다.",
        tag: "현지어 CS 지원",
      },
    ],
  },

  /**
   * 직접 입점 대비 비교 — 제안서 11장.
   *
   * 제목이 말하는 건 하나다 — 같은 일을 직접 하는 것보다, 매일 다루는
   * 팀이 대신하는 쪽이 빠르고 효율적이다. 그 판정을 "다이버즈가 하면
   * 빠릅니다"처럼 형용사로 주장하지 않고, 아래 표에 이미 있는 숫자
   * (입점 소요 기간 40~90일 → 약 14~30일)를 그대로 첫 줄에 올린다.
   * 숫자가 후킹과 근거를 동시에 하고, 마지막 줄은 그게 어디서 나오는지
   * (검증된 입점 인프라)를 받는다 — 근거 없는 우위 주장으로 읽히지
   * 않게 하는 게 이 블록의 핵심이다.
   *
   * 줄은 셋으로 끊는다. 두 줄로 두면 첫 줄이 "40~90일"과 "14~30일"을
   * 한 줄에 다 물어 옆 묶음 제목들보다 유난히 길었다 — 지금은 바뀌기
   * 전(40~90일)과 뒤(14~30일)가 줄로 갈려서, 눈이 아래로 내려가는
   * 동작 자체가 "줄어든다"를 따라 한다.
   *
   * 표 여덟 줄 중 다섯은 부담이 없어지는 쪽(보증금·출금 기준·고정비),
   * 셋은 없던 것이 생기는 쪽(보세 창고 지원, 한국어 관리, CS/AS)이라
   * "가볍다" 한 마디로는 묶이지 않는다. 그래서 제목은 기간 하나만
   * 걸고, 나머지 일곱 줄의 무게는 본문 한 줄과 표가 나눠 받는다.
   */
  comparison: {
    /* 둘째 줄 끝 줄표(—)는 문장이 셋째 줄로 이어진다는 표시다. 세 줄이
       한 문장인데 줄바꿈만 있으면 "약 14~30일로"에서 한 번 끊겨 읽힌다. */
    title:
      "입점 기간 40~90일을\n약 14~30일로 —\n검증된 입점 인프라가 단축합니다",
    body: "같은 일을 매일 다루는 팀이 대신합니다. 보증금/고정비/CS 인력 부담도 함께 내려갑니다 — 브랜드샵 직접 입점과 실무에서 체감하는 차이 8가지를 정리했습니다.",
    rows: [
      { label: "플랫폼 보증금", direct: "있음", alink: "없음" },
      { label: "입점 소요 기간", direct: "40~90일", alink: "약 14~30일" },
      {
        label: "정산 주기",
        direct: "30~60일",
        alink: "플랫폼 정산 후 +1 정산",
      },
      {
        label: "출금 기준",
        direct: "있음 (더우인 $5,000 이상 판매 후)",
        alink: "없음",
      },
      { label: "대행사 고정비", direct: "월 고정비 있음", alink: "없음" },
      {
        label: "보세 창고",
        direct: "자체 해결",
        alink: "상품별 최적화 창고/물류 지원",
      },
      { label: "한국어 관리", direct: "없음", alink: "한국어 UI 관리" },
      {
        label: "CS / AS",
        direct: "추가 필요",
        alink: "전담 운영팀 / AS/CS 제공",
      },
    ],
  },

  /**
   * 입점 플랜 — 제안서 12장.
   *
   * 금액은 지면에 띄우지 않는다(병원 마케팅 패키지와 같은 규칙). 플랜은
   * 이름·대상·포함 범위로만 가르고, 금액은 상담에서 말한다.
   */
  plans: {
    /* 제목은 "무엇을 고르는 자리인지"까지 말한다 — "입점 플랜" 한 마디는
       아래 카드 셋의 이름표일 뿐이라, 왜 셋으로 나뉘는지가 빠져 있었다.
       설명 줄은 두지 않는다 — 무엇이 달라지는지는 바로 아래 카드 셋이
       항목으로 보여 준다. 그걸 문장으로 한 번 더 요약하면 같은 말을
       두 번 읽게 된다. */
    title: "입점 플랜은 필요한 범위만큼\n세 가지로 나눴습니다",
    items: [
      {
        name: "Basic",
        summary: "소매/도매/견적관리/결제 등 기본 기능이 필요한 브랜드",
        includes: [
          "수권 브랜드 1개",
          "상품 SKU 20개",
          "정산 수수료 7%",
          "출금 처리 2~3일",
        ],
        recommended: true,
      },
      {
        name: "Standard",
        summary: "중국 플랫폼 위주로 해외창고/물류 원스톱 지원이 필요한 브랜드",
        includes: [
          "수권 브랜드 2개",
          "여러 은행 출금 가능",
          "견적 관리 지원",
          "정산 수수료 7%",
        ],
        recommended: false,
      },
      {
        name: "Advanced",
        summary: "API/주문/창고 연동 등 ERP 기술 지원이 필요한 브랜드",
        includes: [
          "수권 브랜드 5개",
          "틱톡 / EC2 입점",
          "B2B 자사몰 / API 지원",
          "정산 수수료 5%",
        ],
        recommended: false,
      },
    ],
    note: "모든 이용요금은 부가세(10%) 별도이며 연 단위로 적용됩니다. 마케팅 운영비와 광고비는 별도입니다.",
  },

  /**
   * STAGE 02 — 중국 커머스 마케팅(다이버즈 몫). 제안서 p17~p27.
   *
   * 순서는 제안서를 그대로 따른다.
   *
   *   구매 여정(JOURNEY) → 플랫폼 역할(PLATFORM)
   *   → 서비스(SERVICES) → 운영 패키지(PACKAGES)
   *
   * 금액은 지면에 띄우지 않는다 — 입점 플랜과 같은 규칙이다. 콘텐츠 단가,
   * 셀러 착수금, 광고 수수료율은 제품 카테고리와 방송 조건에 따라 폭이
   * 커서, 지면에 박아 두면 상담에서 다시 뒤집어야 한다.
   */
  marketing: {
    hook: "입점 다음은 마케팅입니다.",
    /**
     * 구매 여정 두 갈래 — 제안서 p17.
     *
     * 제목은 두 갈래를 세는 대신 결론을 바로 말한다("신뢰는 샤오홍슈,
     * 판매는 도우인"). 예전에는 이 결론을 카드 아래 남색 알약에 따로
     * 붙여 뒀는데, 카드 넉 장을 다 읽고 나서야 나오는 자리라 늦었다.
     * 갈래가 둘이라는 사실은 아래 카드 두 장이 이미 보여 준다.
     */
    journey: {
      title: "신뢰는 샤오홍슈에서,\n판매는 도우인에서 만들어집니다",
      body:
        "중국 소비자의 구매는 후기/검색 경로와 라이브커머스 경로 두 갈래입니다. " +
        "브랜드가 어느 경로에 서 있는지에 따라 먼저 손대야 할 마케팅이 달라지고, 두 경로는 각각 다른 플랫폼에서 일어납니다.",
      paths: [
        {
          kind: "신뢰 기반",
          name: "후기 / 검색 기반 구매",
          steps: [
            "인플루언서 후기 콘텐츠 노출로 제품 관심 형성",
            "샤오홍슈에서 브랜드/제품 검색",
            "공식 계정과 추가 후기 확인, 신뢰 형성",
            "구매",
          ],
          note: "화장품, 뷰티, 건강기능식품처럼 구매 전에 정보와 후기를 확인하는 상품에서 주로 나타납니다.",
        },
        {
          kind: "전환 기반",
          name: "라이브커머스 기반 구매",
          steps: [
            "숏폼 콘텐츠 또는 라이브 방송 노출로 브랜드 인지",
            "라이브 셀러/왕홍의 설명과 추천",
            "라이브 한정 혜택 확인",
            "즉시 구매",
          ],
          note: "후기와 콘텐츠로 미리 인지된 브랜드가 라이브에 노출되면 구매 전환 가능성이 높아집니다.",
        },
      ],
    },

    /**
     * 플랫폼 역할 — 제안서 p18.
     *
     * 화면에서는 위 journey 와 한 묶음으로 나간다(JOURNEY 카드 아래쪽 판) —
     * 신뢰 기반 경로가 일어나는 곳이 샤오홍슈, 전환 기반 경로가 일어나는
     * 곳이 도우인이라 둘은 같은 말의 앞뒤다. 그래서 머리말(title·body)은
     * journey 쪽으로 합쳤다.
     *
     * items 순서는 journey.paths 순서와 짝이다(0: 신뢰/샤오홍슈,
     * 1: 전환/도우인). 한쪽을 바꾸면 다른 쪽도 같이 바꿔야 한다.
     */
    platformRoles: {
      items: [
        {
          name: "샤오홍슈",
          en: "XIAOHONGSHU",
          role: "브랜드를 검색하고 검증하는 플랫폼",
          work: [
            "브랜드 공식 계정 운영",
            "중국어 콘텐츠 제작",
            "KOC / KOL 후기 콘텐츠",
            "샤오홍슈 퍼포먼스 광고",
          ],
        },
        {
          name: "도우인",
          en: "DOUYIN",
          role: "상품을 구매하는 플랫폼",
          work: [
            "라이브 방송 반복 노출",
            "판매형 왕홍 라이브커머스",
            "도우인 퍼포먼스 광고",
          ],
        },
      ],
    },

    /** 마케팅 서비스 네 가지 — 제안서 p20~p25. 금액은 넣지 않는다. */
    services: {
      title: "네 가지 마케팅을\n필요한 만큼 조합합니다",
      body: "브랜드 상황에 따라 하나만 집행할 수도, 넷을 이어 붙일 수도 있습니다.",
      items: [
        {
          no: "01",
          name: "샤오홍슈 계정 구축 / 운영",
          body: "중국 소비자가 브랜드를 검색했을 때 확인할 공식 채널을 만들고, 콘텐츠를 매달 쌓습니다.",
          points: [
            "계정 개설과 블루인증(기업인증) 지원",
            "월 15건 콘텐츠 제작 (이미지 5 / 영상 10)",
            "중국어 번역과 현지화",
            "댓글 / DM 관리, 월간 운영 보고",
          ],
        },
        {
          no: "02",
          name: "샤오홍슈 인플루언서 시딩",
          body: "검색 결과에 실제 사용자 후기를 쌓습니다. 제품 배송형과 방문형 두 가지로 진행합니다.",
          points: [
            "인플루언서 섭외와 콘텐츠 방향 전달",
            "업로드 일정 관리와 결과 정리",
            "브랜드 공식 계정 유입 확대",
            "광고 / 라이브 전 신뢰 콘텐츠 확보",
          ],
        },
        {
          no: "03",
          name: "중국 디지털 광고 운영",
          body: "목표와 KPI에 맞춰 매체를 구성합니다. 샤오홍슈, 도우인, 위챗, 웨이보, 바이두를 다룹니다.",
          points: [
            "광고 목표와 KPI 설정",
            "플랫폼별 전략 수립과 캠페인 세팅",
            "타겟 설정과 소재 테스트",
            "예산 최적화와 월간 성과 리포트",
          ],
        },
        {
          no: "04",
          name: "도우인 라이브커머스",
          body: "셀러 등급(Level 1~7)에 따라 초기 확산과 판매 전환 두 방식으로 운영합니다.",
          points: [
            "Level 1~3 — 다수 방송 노출로 브랜드 접점 확대",
            "Level 4~7 — 판매형 셀러/왕홍으로 매출 확대",
            "카테고리와 가격, 판매 이력을 기준으로 셀러 선정",
            "방송 후 실제 구매 유지 확인 뒤 성과 정산",
          ],
        },
      ],
      note: "셀러 착수금과 판매 수수료, 콘텐츠 단가, 광고 매체비는 제품 카테고리와 방송 조건에 따라 달라져 상담에서 안내드립니다.",
    },

    /** 운영 패키지 — 제안서 p26. 금액은 지면에 띄우지 않는다. */
    packages: {
      title: "지금 필요한 조합으로\n네 가지 패키지를 준비했습니다",
      body: "샤오홍슈와 도우인을 브랜드의 목표에 맞춰 묶은 월 운영형 상품입니다.",
      items: [
        {
          name: "MARKET TEST",
          aim: "중국 시장 반응 확인",
          includes: [
            "KOC 시딩 10건~",
            "도우인 L1~3 셀러 라이브 10건~",
            "시장 반응 리포트",
          ],
          target: "중국 시장을 처음 확인하는 브랜드",
          recommended: false,
        },
        {
          name: "BRAND BUILDING",
          aim: "브랜드 신뢰 구축",
          includes: [
            "샤오홍슈 브랜드 계정 운영",
            "콘텐츠 월 15건 (이미지 5 / 영상 10)",
            "KOC 시딩 20건~",
            "월간 운영 리포트",
          ],
          target: "검색했을 때 보여 줄 콘텐츠가 부족한 브랜드",
          recommended: false,
        },
        {
          name: "SALES GROWTH",
          aim: "브랜딩과 판매 성장",
          includes: [
            "모델 활용 콘텐츠 포함",
            "KOL 시딩 10건~",
            "샤오홍슈 / 도우인 광고 운영",
            "도우인 L1~3 셀러 라이브 30건~",
          ],
          target: "후기와 판매 전환을 함께 만들 브랜드",
          recommended: true,
        },
        {
          name: "SCALE UP",
          aim: "본격적인 매출 확장",
          includes: [
            "브랜드별 맞춤 콘텐츠와 캠페인",
            "중대형 인플루언서 시딩",
            "통합 매체 광고 운영",
            "판매형 라이브커머스 연계",
          ],
          target: "중국 마케팅을 본격 확장할 브랜드",
          recommended: false,
        },
      ],
      note: "광고비와 제품 제공비, 배송비, 샘플비, 라이브커머스 판매 수수료는 별도입니다. 판매형 라이브 캠페인은 1회 캠페인형 패키지로 따로 고르실 수 있습니다.",
    },
  },
} as const;

/**
 * CONTENTS — 영상 제작 지면(/service/contents) 하단에 붙는 세 묶음.
 *
 * 내용은 다이버즈 영상 제작 소개서(SERVICES · PROCESS 두 장)를 그대로
 * 옮겼다. 소개서에는 그 사이에 MISSION 장(IDEA / 영상 콘텐츠 / MESSAGE
 * 도식과 프로덕션팀 소개)이 한 장 더 있었는데, 지면에서는 뺐다. 위 services 의 contents 항목이 "무엇을 만드는지"를 한
 * 문단으로 말한다면, 여기는 그 아래에서 장르 / 일하는 방식 / 제작 순서를
 * 차례로 푼다.
 *
 * 묶음마다 title(굵은 한 줄) + body(설명 한 문단)를 둔다 — 이 사이트의
 * 묶음 머리가 전부 그 꼴이라(WHY DIVERZ · 바이럴 프로그램 …) 여기만 다른
 * 구조로 두면 지면에서 문법이 갈린다.
 *
 * 소개서 원문의 가운뎃점(사업·제품)은 지면 문구 규칙에 따라 슬래시로
 * 바꿔 적는다(AGENTS.md).
 */
export const contentsProduction = {
  /**
   * MEDIA SERVICES — 만드는 영상의 갈래 넷.
   *
   * 순서 있는 단계가 아니라 나란한 갈래지만, 지면에서는 번호를 붙인다 —
   * performanceFeatures(강점 3가지)도 순서 없는 항목에 01/02/03 을 달고
   * 있어서, 여기만 번호를 빼면 같은 판형이 두 벌로 보인다.
   */
  genres: {
    // 두 줄로 끊는 자리는 "콘텐츠를" 뒤. 한 줄로 두면 넓은 화면에서 한 줄이
    // 지면을 가로질러 눈이 되돌아올 자리를 잃는다.
    title: "모든 장르의 미디어 콘텐츠를\n기획하고 생산합니다",
    /* 지워졌던 MISSION 장(프로덕션팀 소개)의 문구를 이 자리로 옮겨 왔다 —
       "우리는 다양한 형식과 장르의…"는 바로 위 제목과 같은 말을 한 번 더
       하고 있었다. 첫 줄에서 끊는다: 앞은 무엇을 만들어 주는지, 뒤는 누가
       만드는지라 한 문단으로 붙이면 두 이야기가 뭉갠다. */
    body:
      "클라이언트의 니즈를 가장 효과적인 형태의 비주얼로\n" +
      "프로듀서, 작가, 촬영감독, 편집감독으로 이루어진 프로덕션팀이 프로젝트의 A부터 Z까지 콘텐츠 제작을 책임집니다.",
    /** image — 갈래마다 그 결과물이 어떤 것인지 한 장으로 보여 주는 사진. */
    items: [
      {
        name: "모션그래픽 / CG",
        body: "애니메이션 테크닉을 이용한 2D Graphic과 3D Max, UNREAL Engine을 통한 3D Graphic",
        image: "/images/contents/motion-graphic.png",
      },
      {
        name: "종합 광고 영상",
        body: "기업, 공공기관 등에 필요한 브랜드 필름, TVCF, 사업/제품 광고 영상",
        image: "/images/contents/ad-film.jpg",
      },
      {
        name: "SNS 바이럴 콘텐츠",
        body: "인스타그램, 유튜브 등 SNS에 타겟팅한 감각적이고 트렌디한 바이럴 광고 영상",
        image: "/images/contents/sns-viral.png",
      },
      {
        name: "3D 360VR",
        body: "11K 360 Camera와 입체 Graphic을 통해 새로운 차원의 몰입형 360VR",
        image: "/images/contents/vr-360.png",
      },
    ],
  },

  /**
   * PROCESS — 미팅에서 납품까지 아홉 단계.
   *
   * 제목 없이 설명 한 줄로 시작한다 — 퍼포먼스의 PERFORMANCE PROCESS 도
   * 라벨 바로 아래가 곧 흐름이다.
   *
   * 넓은 화면에서는 그라디언트 바 두 줄에 나눠 싣는다(위 다섯 · 아래 넷 —
   * components/contents-production.tsx). 단계를 더하거나 뺄 때는 그
   * 나누는 자리도 같이 본다.
   */
  process: {
    body: "제작방식 / 규모에 따라 약 2주~10주의 제작기간이 소요됩니다.",
    steps: [
      { title: "미팅", body: "제작 방향에 대한 협의" },
      { title: "제안 / 견적", body: "제안 / 견적 / 레퍼런스 등을 제공" },
      { title: "기획회의", body: "화면 / 내레이션 등 구성" },
      { title: "시나리오 작성", body: "구체적인 시나리오 작성" },
      { title: "제작회의", body: "촬영장소 헌팅, 출연자, 성우 섭외" },
      { title: "촬영", body: "촬영 진행" },
      { title: "종합편집", body: "컷편집, D.I, CG 등의 종합편집" },
      { title: "사운드디자인", body: "성우녹음, BGM / 효과음 작업" },
      { title: "시사 / 납품", body: "시사 및 최종 피드백 반영하여 납품" },
    ],
  },
} as const;

/**
 * RECRUITING — 채용 지면(/recruiting)에 쓰는 데이터 전부.
 *
 * 내용은 실제 하반기 채용 공고 배너 3종(퍼포먼스 마케팅 팀장 · 콘텐츠팀 PD ·
 * 광고 영업기획 팀장)에서 그대로 옮겼다. 배너에 없는 말은 넣지 않는다 —
 * 채용 지면에서 지어낸 제도나 숫자는 입사 첫날에 바로 들통난다.
 *
 * 배너는 공고마다 한 장씩 따로 있지만 지면은 한 장이다. 그래서 세 배너가
 * 똑같이 반복하는 부분(회사 소개 · BENEFIT · WHO WE WANT · PROCESS)은
 * 공통으로 한 번만 두고, 배너마다 다른 부분(POSITION, 영업기획에만 있는
 * TREATMENT)만 직군 안으로 넣었다.
 *
 * 지원은 폼이 아니라 메일로 받는다. 이력서/포트폴리오가 첨부로 오가는 게
 * 자연스럽고, 폼을 두면 파일 업로드 저장소까지 따라와야 한다.
 */
export const recruit = {
  /** 지원 메일. 채용 전용 주소가 생기면 여기만 바꾼다. */
  email: company.email,
  /** 메일 제목 앞에 붙는 말머리. "[다이버즈 지원] 퍼포먼스 마케팅" 꼴이 된다. */
  subjectPrefix: "다이버즈 지원",

  /**
   * 히어로 — 배경이 화면에 붙어 있고 문구만 1단계 → 2단계로 갈린다
   * (components/recruit-hero.tsx).
   */
  hero: {
    /** 질문 위에 작게 얹는 라벨. 이 지면이 무엇인지 알려 준다. */
    label: "다이버즈 하반기 채용",
    /**
     * 1단계 — 화면을 꽉 채우는 질문.
     *
     * 배너에는 없는 문장이다. 회사 슬로건 "DIVE DEEP"을 읽는 사람에게
     * 되돌려 묻는 형태로 옮겼다 — 채용 지면의 첫 화면은 회사가 자기 소개를
     * 하는 자리가 아니라 읽는 사람이 자기 얘기라고 느끼는 자리여야 한다.
     */
    question: "당신이 가장 깊이\n파고들었던 일은 무엇인가요?",
    /** 2단계 — 굵게 남는 문단들. 배너 문구 그대로. */
    body: [
      "다이버즈는 브랜드와 세상을 연결하는\nIMC(종합광고마케팅) 파트너입니다.",
      "다이버즈와 함께 가장 깊이 뛰어들고\n누구보다 빠르게 성장해 나아갈 유능한 인재를 찾습니다.",
    ],
    /** 2단계 맨 아래, 한 톤 낮춰 붙는 마무리. 배너 문구 그대로. */
    outro:
      "좋은 사람 한 명이 회사의 방향을 바꾼다고 믿기에,\n함께할 분에게는 그만큼 확실하게 보답하겠습니다.",
  },

  /* 배너의 WHAT WE DO(다이버즈가 직접 하는 다섯 영역)는 지면에서 뺐다.
     회사가 무슨 일을 하는지는 바로 위 회사 소개와 SERVICE 지면이 이미
     말하고 있어서, 채용 지면에서는 같은 얘기를 한 번 더 하는 자리였다. */

  /**
   * BENEFIT — 배너의 3×3 아홉 칸. 순서까지 배너를 따른다.
   *
   * id 는 지면에서 아이콘을 짝지을 때 쓴다(아이콘은 컴포넌트라 이 파일에
   * 둘 수 없다 — lib/site.ts 는 React 를 들이지 않는다).
   */
  benefits: {
    title: "일에만 집중하세요!\n나머지는 다이버즈가 챙깁니다.",
    items: [
      {
        id: "education",
        title: "더 배우고 싶다면?",
        body: "자기개발 비용(교육비) 지원",
      },
      {
        id: "tools",
        title: "툴 걱정은 그만!",
        body: "업무 효율 소프트웨어 무한 지원",
      },
      {
        id: "referral",
        title: "좋은 사람 있으면 소개해요",
        body: "인재 추천 인센티브 제공",
      },
      { id: "dresscode", title: "편한 게 최고!", body: "자율복장" },
      { id: "snack", title: "당 떨어질 땐?", body: "사내 간식 제공" },
      { id: "leave", title: "쉴 땐 쉬어야지!", body: "연월차 자유 사용" },
      { id: "promotion", title: "잘하면 빨리 갑니다", body: "조기 승진 기회" },
      { id: "holiday", title: "명절엔 두 손 무겁게", body: "명절 선물 지급" },
      {
        id: "flextime",
        title: "아침은 여유롭게",
        body: "유연 출근제 (8시~10시)",
      },
    ],
  },

  /** WHO WE WANT — 배너의 다섯 사람. */
  whoWeWant: {
    title:
      "이런 사람과 함께 집요하게 파고들고\n브랜드의 성장을 만들고 싶습니다.",
    /**
     * 다섯 사람.
     *
     * text 는 배너 문구 그대로다. body 는 배너에 없는 문장으로, 한 단어짜리
     * 인재상만으로는 카드가 비어 보여서 그 말이 실제로 무슨 뜻인지 한 줄로
     * 풀어 둔 것이다. 회사 사실(제도·숫자)이 아니라 태도를 설명하는 문장이라
     * 지어내도 어긋날 값이 없다 — 그래도 확정 문구가 오면 여기만 바꾸면 된다.
     *
     * image 는 카드 배경에 깔리는 실제 다이버즈 팀 촬영 사진이다(서비스
     * 지면이 쓰는 것과 같은 파일). 사진과 문구 사이에 뜻이 이어지는 관계는
     * 없다 — 사람이 일하는 판이 필요할 뿐이라 순서대로 나눠 썼다.
     *
     * id 는 지면에서 아이콘을 짝지을 때 쓴다(아이콘은 컴포넌트라 이 파일에
     * 둘 수 없다 — lib/site.ts 는 React를 들이지 않는다).
     */
    items: [
      {
        id: "grit",
        text: "독기 있는 사람",
        body: "안 되는 이유를 찾기보다, 되게 하는 방법을 끝까지 찾습니다.",
        image: "/images/service/performance.png",
      },
      {
        id: "proactive",
        text: "능동적으로 일하는 사람",
        body: "지시를 기다리지 않고 먼저 제안하고 먼저 움직입니다.",
        image: "/images/service/imc.png",
      },
      {
        id: "growth",
        text: "성장에 목마른 사람",
        body: "어제보다 나은 결과를 내기 위해 계속 배우고 시도합니다.",
        image: "/images/service/viral.png",
      },
      {
        id: "achieve",
        text: "성취하고 인정받고 싶은 사람",
        body: "성과를 숫자로 증명하고, 그만큼 확실하게 보상받습니다.",
        image: "/images/service/global.png",
      },
      {
        id: "breakthrough",
        text: "돌파구를 찾는 사람",
        body: "막혔을 때 다른 길을 만들어 성과로 연결합니다.",
        image: "/images/service/contents.png",
      },
    ],
  },

  /**
   * 모집 직군.
   *
   * sections 는 배너의 회색 라벨 블록을 그대로 옮긴 것이다. 공고마다 라벨이
   * 달라서(자격요건 / 필수요건, 콘텐츠 PD에만 있는 "프로젝트 운영/관리")
   * 이름을 고정하지 않고 배열로 둔다.
   */
  positions: [
    {
      id: "sales-planning-lead",
      name: "광고 영업기획",
      role: "팀장 2명",
      /**
       * TREATMENT — 이 공고에만 붙는 대우 조건. 세 배너 중 영업기획에만 있어서
       * 공통 블록이 아니라 직군 안에 둔다.
       */
      treatment: {
        title: "업계 최고 대우 자신있게 보장합니다.",
        body: "최고 대우가 아니다? 회사 정책을 바꿔서라도 최고 대우 보장해드립니다.",
        items: [
          { no: "01", label: "정착지원금", value: "500만원" },
          { no: "02", label: "업계 최고 수준", value: "인센티브" },
          { no: "03", label: "정규직/프리랜서", value: "선택 가능" },
        ],
      },
      sections: [
        {
          label: "담당업무",
          items: [
            "영업 전략 수립",
            "아웃바운드 영업 및 계약 클로징",
            "영업 데이터 수집 및 분석",
            "CRM 기반 고객 관리",
            "영업 사원 관리 및 육성, 팀빌딩",
            "영업 시스템 관리 및 문서화",
          ],
        },
        {
          label: "자격요건",
          items: [
            "아웃바운드 TM 영업조직 리드 경험과 성과 개선 사례를 보유하신 분",
            "디지털 마케팅 시장에 대한 폭 넓은 인사이트를 보유하신 분",
            "성과 분석 및 진단, 솔루션을 도출할 수 있는 분",
            "다양한 영업 방식을 시도하고, 성과를 만들어 내보신 분",
          ],
        },
        {
          label: "우대사항",
          items: [
            "동종 업계 내 3년 이상의 경력이 있으신 분",
            "5명 이상의 팀 단위 조직관리 및 목표 설정 경험이 있으신 분",
            "아웃바운드 영업에 대한 자신감과 이해도가 높으신 분",
          ],
        },
      ],
    },
    {
      id: "performance-lead",
      name: "퍼포먼스 마케팅",
      /** 직급/인원. 배너의 제목 아래 작은 줄. */
      role: "팀장",
      sections: [
        {
          label: "담당업무",
          items: [
            "자사의 플랫폼 및 서비스 미디어 믹스 설계 및 운영",
            "메타, 네이버, 카카오, 구글 주요 매체 광고 전략 수립 및 운영",
            "광고 소재 기획 및 유관부서 협업을 통한 소재 제작",
            "광고 성과 데이터 분석 및 최적화",
            "퍼포먼스팀 관리 및 육성, 팀빌딩",
            "팀 시스템 관리 및 문서화",
          ],
        },
        {
          label: "자격요건",
          items: [
            "광고대행사 또는 퍼포먼스 마케팅 경력 3년 이상",
            "GA4 / GTM 활용 능력",
            "광고 기획 능력",
            "제안서 작성 능력",
          ],
        },
        {
          label: "우대사항",
          items: [
            "동종 업계 내 3년 이상의 경력이 있으신 분",
            "5명 이상의 팀 단위 조직관리 및 KPI 설정 경험이 있으신 분",
            "데이터 관리 능력이 뛰어나신 분",
            "커뮤니케이션 능력이 뛰어나신 분",
          ],
        },
      ],
    },
    {
      id: "contents-pd",
      name: "콘텐츠팀 PD",
      role: "정규직",
      sections: [
        {
          label: "담당업무",
          items: [
            "연출 및 제작",
            "기획/구성안 및 트리트먼트 작성",
            "콘티, 촬영 연출, 현장 디렉팅",
            "편집 방향 설정 및 후반 작업 검수",
            "CG/AI 영상 등 제작 방식 설계",
            "숏츠 제작 총괄",
          ],
        },
        {
          label: "프로젝트 운영/관리",
          items: [
            "클라이언트 커뮤니케이션 및 피드백 정리",
            "일정/예산 수립과 진행 관리",
            "스태프/협력사 섭외 및 조율",
            "산출물 납품과 프로젝트 대금 정산",
          ],
        },
        {
          label: "필수요건",
          items: [
            "영상 제작 경력 5년 이상",
            "운전면허증(2종 보통 이상) 보유 [필수]",
            "Premiere Pro, After Effects, Photoshop 활용 가능",
            "촬영 일정에 따른 지방/주말 출장 가능",
            "해외여행 결격 사유 없는 자",
          ],
        },
        {
          label: "우대사항",
          items: [
            "광고 프로덕션/대행사 근무 경험",
            "숏츠 이해도",
            "AI 영상 툴(Midjourney, Runway, Veo 등) 제작 경험",
          ],
        },
      ],
    },
  ],

  /** PROCESS — 배너의 STEP 01~03. */
  process: [
    { no: "STEP 01", title: "서류접수" },
    { no: "STEP 02", title: "인터뷰" },
    { no: "STEP 03", title: "최종 합격" },
  ],
} as const;
