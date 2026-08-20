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
  // "\n"으로 세 문단을 나눈다. 화면에서는 줄바꿈으로, 메타데이터에서는 공백으로 처리한다.
  intro:
    "다이버즈는 넓은 시장 속에서\n마케팅 전략 없이 헤매고 있는 브랜드들을 찾아내고\n그들의 잠재력을 수면 위로 끌어올립니다.",
  positioning: "우리는 브랜드를 발굴하고 성장시키는 IMC 마케팅 그룹입니다.",
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
      { href: "/service#imc", label: "IMC 마케팅" },
      { href: "/service#performance", label: "퍼포먼스 마케팅" },
      { href: "/service#viral", label: "바이럴" },
      { href: "/service#global", label: "글로벌 마케팅" },
      { href: "/service#contents", label: "콘텐츠" },
    ],
  },
  { href: "/work", label: "WORK" },
  { href: "/contact", label: "CONTACT" },
];

/** 홈 WHAT WE DO — 브랜드의 3축 */
/**
 * 성과 수치.
 * 주의: 원본 사이트는 "누적 캠페인 129,645"와 "캠페인 수행 100만 건"을 동시에 표기해
 * 서로 모순된다. 확인 전까지는 근거가 분명한 수치만 노출한다.
 */
export const stats = [
  { label: "재계약률", value: 90, suffix: "%+", note: "다시 찾는 파트너" },
  { label: "누적 프로젝트", value: 588, suffix: "+", note: "업종 불문 실행" },
  { label: "누적 캠페인", value: 129645, suffix: "+", note: "데이터로 축적된 실행" },
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
    tagline: "하나의 전략으로 연결되는\n브랜드 경험",
    // 줄바꿈을 강제하지 않는다 — 문장마다 "\n"으로 끊으면 컬럼 폭이 바뀔 때
    // 마지막 한두 글자가 다음 줄에 혼자 남는 고아 줄이 생긴다. 자연 개행에 맡긴다.
    summary:
      "광고, SNS 콘텐츠, 프로모션, 오프라인 캠페인 등 다양한 마케팅 활동을 하나의 목표와 메시지로 통합하는 전략입니다. " +
      "채널을 따로 운영하지 않고, 고객의 관심과 행동 데이터를 바탕으로 채널별 역할과 콘텐츠를 유기적으로 설계합니다.",
    points: ["채널 통합 전략", "메시지 일관성", "전환 퍼널 설계"],
  },
  {
    slug: "performance",
    // 실제 다이버즈 팀 촬영 사진.
    image: "/images/service/performance.png",
    en: "PERFORMANCE MARKETING",
    name: "퍼포먼스 마케팅",
    tagline: "광고비 1원까지 추적하는\n퍼포먼스 최적화",
    summary:
      "광고비 1원의 효율까지 추적합니다. ROAS 중심으로 매체를 운영하고 실시간으로 최적화합니다.",
    points: ["ROAS 중심 운영", "META", "GDN", "NAVER", "검색광고", "월별 리포트"],
  },
  {
    slug: "viral",
    // 실제 다이버즈 팀 촬영 사진.
    image: "/images/service/viral.png",
    en: "VIRAL",
    name: "바이럴",
    tagline: "스스로 퍼지게 설계하는\n바이럴 확산 구조",
    summary:
      "인플루언서 시딩과 커뮤니티 확산으로 브랜드가 스스로 회자되는 구조를 만듭니다.",
    points: ["네이버 블로그", "네이버 카페", "상위노출", "인스타그램 시딩", "당근 Ads"],
  },
  {
    slug: "global",
    // 실제 다이버즈 팀 촬영 사진.
    image: "/images/service/global.png",
    en: "GLOBAL MARKETING",
    name: "글로벌 마케팅",
    // TODO: 확정 카피 대기 중. 아래 태그라인/요약/키워드는 다른 서비스의 형식에
    // 맞춰 임시로 쓴 초안이라, 실제 서비스 범위와 다를 수 있다.
    tagline: "현지 채널과 언어로 확장하는\n글로벌 브랜드 진출",
    summary:
      "국가별 검색·커머스 환경에 맞춰 현지 채널과 언어로 브랜드를 알립니다. 진출 준비부터 현지 운영까지 함께 설계합니다.",
    points: ["현지 채널 운영", "다국어 콘텐츠", "국가별 타겟 설계"],
  },
  {
    slug: "contents",
    // 실제 다이버즈 팀 촬영 사진.
    image: "/images/service/contents.png",
    en: "CONTENTS",
    name: "콘텐츠",
    tagline: "보자마자 반응하게 만드는\n성과형 콘텐츠",
    summary:
      "브랜드의 언어를 영상·이미지·카피로 번역합니다. 숏폼부터 광고 소재까지 성과를 기준으로 만듭니다.",
    points: ["숏폼·영상 제작", "광고 소재", "브랜드 카피"],
  },
] as const;

/** IMC 마케팅 6단계 */
export const imcProcess = [
  { no: "01", title: "브랜드 진단", body: "업종, 타겟, 제품·서비스 진단" },
  { no: "02", title: "메시지 정의", body: "캠페인 목적에 따른 메시지 정립" },
  { no: "03", title: "채널 믹스 설계", body: "타겟별 채널 효율 분석 기반 믹스" },
  { no: "04", title: "전환 퍼널 설계", body: "고객 여정 중심 KPI 세팅" },
  { no: "05", title: "콘텐츠 통합 기획", body: "비주얼, 영상, 카피라이팅 제작" },
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
export const cases = [
  {
    client: "A지역 피부과",
    headline: "1개월 만에 일매출 10배 성장",
    /** WHO WE ARE PROOF 섹션의 성장 그래프. 흰 배경용 투명 PNG. */
    graph: "/images/cases/case-01-growth.png",
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
    graph: "/images/cases/case-02-growth.png",
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
  { name: "Google Display Network", src: "/images/imc/google-display-network.png" },
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

export const clientLogos = [
  // 금융·보험
  { name: "AXA", src: "/images/clients/axa.png", category: "금융·보험" },
  { name: "삼성카드", src: "/images/clients/samsung-card.png", category: "금융·보험" },
  { name: "KB국민카드", src: "/images/clients/kb-card.png", category: "금융·보험" },
  { name: "한화손해보험", src: "/images/clients/hanwha-insurance.png", category: "금융·보험" },
  { name: "메리츠화재", src: "/images/clients/meritz-fire.png", category: "금융·보험" },
  { name: "라이나생명", src: "/images/clients/lina-life.png", category: "금융·보험" },
  { name: "DB손해보험", src: "/images/clients/db-insurance.png", category: "금융·보험" },
  { name: "현대해상", src: "/images/clients/hyundai-insurance.png", category: "금융·보험" },
  { name: "미래에셋증권", src: "/images/clients/mirae-asset.png", category: "금융·보험" },
  { name: "하이투자증권", src: "/images/clients/dgb-hi-investment.png", category: "금융·보험" },
  { name: "코인원", src: "/images/clients/coinone.png", category: "금융·보험" },

  // 통신·미디어·커머스
  { name: "SK브로드밴드", src: "/images/clients/sk-broadband.png", category: "미디어·커머스" },
  { name: "웅진", src: "/images/clients/woongjin.png", category: "미디어·커머스" },
  { name: "SOOP", src: "/images/clients/soop.png", category: "미디어·커머스" },
  { name: "한국경제TV", src: "/images/clients/hankyung-tv.png", category: "미디어·커머스" },
  { name: "TV조선", src: "/images/clients/tv-chosun.png", category: "미디어·커머스" },
  { name: "NS홈쇼핑", src: "/images/clients/ns-homeshopping.png", category: "미디어·커머스" },
  { name: "아모레퍼시픽", src: "/images/clients/amorepacific.png", category: "미디어·커머스" },

  // 럭셔리·주류
  { name: "Bentley", src: "/images/clients/bentley.png", category: "럭셔리·주류" },
  { name: "HERMÈS", src: "/images/clients/hermes.png", category: "럭셔리·주류" },
  { name: "Porsche", src: "/images/clients/porsche.png", category: "럭셔리·주류" },
  { name: "Rolls-Royce", src: "/images/clients/rolls-royce.png", category: "럭셔리·주류" },
  { name: "Hendrick's Gin", src: "/images/clients/hendricks-gin.png", category: "럭셔리·주류" },
  { name: "The Balvenie", src: "/images/clients/the-balvenie.png", category: "럭셔리·주류" },
  { name: "Lillet", src: "/images/clients/lillet.png", category: "럭셔리·주류" },
  { name: "Hennessy", src: "/images/clients/hennessy.png", category: "럭셔리·주류" },
] as const;

/**
 * 강점 요약. label(작게)/value(크게) 두 줄로 읽힌다.
 *
 * 4번 "캠페인 수행 100만 건"은 위 stats의 "누적 캠페인 129,645"와 자릿수가
 * 맞지 않는다. 원본 사이트가 두 수치를 함께 쓰고 있고, 이 섹션에는 100만 건으로
 * 노출하기로 확인받았다. 둘 중 하나를 고칠 일이 생기면 같이 맞춰야 한다.
 */
export const strengths = [
  { label: "요식업, 뷰티, 병원 등", value: "다양한 업종별 성과 경험" },
  { label: "브랜딩 / 콘텐츠 / 바이럴 / 퍼포먼스", value: "올인원 조직" },
  { label: "재계약률", value: "90% 이상" },
  { label: "캠페인 수행", value: "100만 건" },
] as const;
