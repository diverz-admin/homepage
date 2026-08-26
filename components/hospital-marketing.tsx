import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  CalendarClock,
  Headset,
  Heart,
  Megaphone,
  MessagesSquare,
  Settings,
  Star,
  UserPlus,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

import Reveal from "@/components/reveal";
import { SOLUTION_BG } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { hospitalMarketing } from "@/lib/site";

/**
 * system.steps(아홉 단계, 그냥 문자열 배열)에 순서대로 붙일 아이콘.
 * 데이터 파일은 리액트 컴포넌트를 못 들고 있어(서버/클라이언트 경계)
 * 화면 쪽에서 붙인다 — steps 순서가 바뀌면 이 배열도 같이 맞춰야 한다.
 */
const systemStepIcons: LucideIcon[] = [
  UserPlus, // 공식 계정 구축
  Settings, // 계정 세팅
  CalendarCheck, // 월 15개 콘텐츠 운영
  Heart, // 인/아웃 인게이지먼트
  Megaphone, // 기자단/체험단 확산
  Users, // 병원 공식 계정 유입
  Headset, // 샤오홍슈 CS / 위챗 유입
  MessagesSquare, // 병원 상담실 상담
  CalendarClock, // 예약 전환
];

/**
 * 글로벌 마케팅 대제목 아래로 매달리는 첫 상품.
 *
 *   01 중국인 유입 병원 마케팅
 *
 * 흐름은 제안서를 그대로 따른다.
 *
 *   후킹 + 계정 화면 → 유입 시스템 아홉 단계(어두운 띠)
 *   → 공식 계정과 외부 콘텐츠 → 패키지 → 닫는 한 줄
 *
 * 유입 시스템 아홉 단계는 AS-IS(타사)/TO-BE(다이버즈) 두 카드에 같은
 * 아홉 줄을 나란히 놓고 O/X로 가른다 — 두 카드가 서로 다른 목록을 들고
 * 있으면(한쪽은 짧고 한쪽은 길면) 줄 수가 달라 카드 높이가 안 맞고,
 * "타사는 뭘 안 하는지"도 흐려진다. 같은 아홉 줄이 타사 카드에서는
 * 대부분 X로, 다이버즈 카드에서는 전부 O로 찍혀야 "같은 일인데 여기는
 * 안 하고 저기는 한다"는 게 한눈에 든다.
 *
 * 예전에 있던 "중국 고객의 의사결정 여정"(검색 → 후기 → 위치 → 방문 → 위챗)
 * 다섯 칸은 뺐다. 같은 내용이 바로 위 후킹 문단의 첫 문장에 이미 들어 있어서,
 * 흐름이 시작하기도 전에 같은 말을 두 번 하게 됐다. 데이터(lib/site.ts의
 * journey)는 남겨 뒀다 — 다시 세울 일이 생기면 그대로 쓰면 된다.
 *
 * 위 글로벌 블록은 번호가 없다 — 그 블록은 나란한 묶음이 아니라 이 페이지
 * 전체의 대제목이라서다(components/service-detail.tsx). 번호는 그 밑에
 * 매달리는 상품들끼리 센다.
 *
 * 색은 흰 지면 위에서는 역할 토큰(text-foreground 등)을 쓰고, 어두운 칸
 * 안에서만 절대 팔레트(bg-abyss·text-white)를 쓴다. 그 안쪽은 이 페이지의
 * .on-light 반전이 닿지 않는 자리라, 토큰을 그대로 쓰면 글자가 배경에 묻는다.
 */

/**
 * system.steps 아홉 줄에 아이콘과 "타사가 커버하는가"를 붙인다.
 * 타사는 계정을 만들고 세팅하는 데서 끝난다 — 처음 두 줄만 O, 나머지
 * 일곱 줄(콘텐츠 운영부터 예약 전환까지)은 X다.
 */
function toSystemRows(system: typeof hospitalMarketing.system) {
  return system.steps.map((step, i) => ({
    step,
    Icon: systemStepIcons[i],
    competitorCovers: i < 2,
  }));
}

/** 덩어리 머리에 놓는 영문 라벨. NEXT 줄과 같은 규격이다. */
function BlockLabel({ children }: { children: React.ReactNode }) {
  return (
    <Reveal>
      <p className="font-display text-xs font-bold tracking-[0.3em] text-accent">
        {children}
      </p>
    </Reveal>
  );
}

/**
 * 패키지 3종 + 통합 패키지를 한 줄에 놓기 위해 한 모양으로 편다.
 *
 * lib/site.ts 쪽 데이터(items·bundle)는 손대지 않는다 — bundle은 원래
 * 2단 레이아웃(왼쪽 어두운 칸 + 오른쪽 INCLUDED 표)용으로 label/body 쌍을
 * 갖춘 더 풍부한 모양이라, 그 구조 자체는 다른 자리에서 다시 쓸 수도 있다.
 * 여기서는 표시 직전에만 다른 셋과 같은 카드 모양(이름·설명·불릿 목록)으로
 * 맞춘다.
 */
function toPackageCards(packages: typeof hospitalMarketing.packages) {
  return [
    ...packages.items.map((item) => ({
      key: item.name,
      name: item.name,
      summary: item.summary,
      features: item.includes,
      highlighted: false,
      popular: false,
    })),
    {
      key: packages.bundle.name,
      name: packages.bundle.name,
      summary: packages.bundle.summary,
      features: packages.bundle.includes.map((line) => line.label),
      highlighted: true,
      popular: true,
    },
  ];
}

export default function HospitalMarketing() {
  const { hook, title, summary, system, contents, packages } =
    hospitalMarketing;
  const packageCards = toPackageCards(packages);
  const systemRows = toSystemRows(system);

  return (
    <section>
      {/* 후킹 + 샤오홍슈 계정 화면.
          화면 예시를 오른쪽에 세운다 — "먼저 샤오홍슈에서 확인합니다"를
          말로만 두면 남의 나라 앱 이야기로 흘러가고, 실물이 옆에 있어야
          무엇을 보고 결정한다는 말인지 잡힌다.

          글의 정렬은 왼쪽이다 — 이커머스 탭(components/ecommerce-marketing.tsx)이
          왼쪽 정렬이라 탭을 오갈 때 글의 시작점이 튀면 안 된다. 아래 묶음들
          (WHY DIVERZ / PACKAGE)도 이미 왼쪽 정렬이라, 여는 문단만 가운데로
          두면 이 상품 안에서도 축이 두 개가 된다.

          lg 미만에서는 글이 먼저, 화면이 그 아래로 내려간다 — 좁은 화면에서
          옆에 세우면 글이 눌려 글자 단위로 깨진다. */}
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
        <div>
          {/* 상품 이름표는 두지 않는다 — 바로 위 탭(ChipTabs)에 이미 같은 문구가
            떠 있어서, 그 아래 한 번 더 적으면 같은 말을 두 번 한다.
            어느 상품 이야기인지는 활성 탭이 말해 준다.

            대신 그 자리에 공감 한 줄(hook)을 얹는다. 이커머스 탭과 같은
            규격이다 — 두 상품이 탭으로 나란히 서므로 여는 방식이 달라지면
            안 된다(components/ecommerce-marketing.tsx). */}
          <Reveal delay={40}>
            <p className="text-fluid-lg font-bold tracking-[-0.02em] break-keep text-accent">
              {hook}
            </p>
          </Reveal>

          <Reveal delay={60}>
            {/* 크기는 위 글로벌 블록의 제목(ServiceSection의 h2)과 같은 급으로
              맞춘다. 여기서 더 작으면 이 묶음이 곁다리로 읽힌다. */}
            <h3
              style={{ lineHeight: 1.15 }}
              className="mt-3 font-display text-fluid-2xl font-bold tracking-tight whitespace-pre-line break-keep text-foreground"
            >
              {title}
            </h3>
          </Reveal>

          <Reveal delay={80}>
            {/* 폭 상한은 두지 않는다 — 왼쪽 칸(1.35fr) 자체가 이미 한 줄
                길이를 잡아 준다. 여기에 max-w 를 더 걸면 칸 오른쪽이 그만큼
                빈 채로 남아, 옆 화면 예시와의 사이가 어정쩡하게 벌어진다. */}
            <p className="mt-6 text-fluid-lg leading-[1.85] font-normal tracking-[-0.04em] break-keep text-foreground/85">
              {summary}
            </p>
          </Reveal>
        </div>

        <Reveal delay={100} className="lg:pt-2">
          {/* 실제 운영 계정 화면 — 기울여 세운 기기 목업으로 받았다.
              그림 자체가 기기 테두리와 바닥 그림자를 이미 물고 있고 배경도
              흰색으로 구워져 있어서, 지면에 그대로 얹는다. 예전처럼 둥근
              테두리 상자에 담으면 틀 안에 틀이 생기고, 기울어진 기기의
              모서리가 그 상자에 잘린다.

              폭 상한이 예전(340px)보다 넉넉한 건 그림이 커져서가 아니다 —
              기울어진 기기 둘레로 흰 여백이 함께 구워져 있어, 같은 상한을
              주면 기기 자체는 오히려 작아진다. 480px 이면 화면 부분이
              예전 평면 스크린샷과 비슷한 크기로 선다.

              계정명과 얼굴은 원본에서 이미 가려져 있다. */}
          <div className="mx-auto w-full max-w-[480px]">
            <Image
              src="/images/service/global/xiaohongshu-account-mockup.png"
              alt="샤오홍슈 병원 공식 계정 화면 예시 — 인증 배지가 붙은 프로필, 팔로워와 좋아요 수, 병원 내부와 방문 콘텐츠가 격자로 쌓인 노트 목록"
              width={678}
              height={900}
              sizes="480px"
              className="h-auto w-full"
            />
          </div>
        </Reveal>
      </div>

      {/* 유입 시스템 — 타사 VS. 다이버즈.

          두 칸에 아홉 줄을 똑같이 깐다. 예전에는 타사 칸에 두 줄만 넣고
          길이 차이로 "여기서 멈춘다"를 보였는데, 그러면 (1) 타사 칸 아래로
          800px 가까운 빈자리가 남아 화살표 하나로 메워야 했고 (2) 무엇보다
          "무엇이 빠졌는지"를 알 수 없었다 — 두 목록의 글자를 하나하나
          맞춰 봐야 콘텐츠 운영부터 예약 전환까지 일곱 줄이 없다는 게
          보였다. 같은 아홉 줄을 깔고 타사 쪽 일곱 줄을 흐리게 죽이면
          어느 단계에서 끊기는지가 줄 단위로 바로 읽힌다.

          색은 중국 이커머스 탭에서 세운 문법을 그대로 쓴다 — 남(타사)은
          밝은 회색, 우리(다이버즈)는 남색 그라디언트(SOLUTION_BG).
          두 탭이 나란히 서므로 "어느 쪽이 답인지"를 가리키는 색이
          달라지면 안 된다.

          제목 자리는 아래 PACKAGE 묶음과 같은 형식(BlockLabel + h4 +
          본문, 왼쪽 정렬)으로 맞춘다 — 한 페이지 안에서 큰 제목 두 개가
          서로 다른 격식이면 어느 쪽이 더 큰 묶음인지 헷갈린다.

          제목을 왼쪽 5칸, 두 박스를 오른쪽 7칸에 나란히 세운다. 예전에는
          제목 아래로 박스를 통째로 깔았는데, 박스 묶음이 max-w-4xl 이라
          그 오른쪽으로 지면 절반이 빈 채 남았다 — 이커머스 탭의
          COMPARISON 묶음(components/ecommerce-marketing.tsx)이 이미 같은
          꼴로 서 있어서, 탭을 오가도 "견주는 자리"의 배치가 같다.

          lg:items-start — 제목이 박스 높이를 따라 세로 가운데로 밀리면
          안 된다.

          위 여백은 공용 .section-gap(176px)이 아니라 그 절반쯤으로 줄인다.
          바로 위 후킹 묶음이 2단인데 왼쪽 글이 짧고 오른쪽 목업만 길어서,
          이 묶음이 시작하는 왼쪽에서는 글이 끝난 자리부터 빈칸이 이미
          400px 넘게 이어진다 — 거기에 176px을 더 얹으면 두 묶음이 끊어져
          보인다. 공용 값을 건드리지 않고 이 자리에서만 줄인다(다른 묶음은
          위아래가 모두 글로 차 있어 176px이 맞다). */}
      <div className="mt-20 grid gap-10 sm:mt-24 lg:grid-cols-12 lg:items-start lg:gap-12">
        <div className="lg:col-span-5">
          <BlockLabel>WHY DIVERZ</BlockLabel>

          <Reveal delay={60}>
            <h4 className="mt-5 font-display text-fluid-2xl font-bold tracking-tight whitespace-pre-line break-keep text-foreground">
              {system.title}
            </h4>
          </Reveal>

          <Reveal delay={80}>
            <p className="mt-5 text-fluid-base leading-[1.9] tracking-[-0.03em] break-keep text-foreground/80">
              {system.body}
            </p>
          </Reveal>
        </div>

        {/* 세 줄(이름표 · 박스 · 맺음말)을 grid-rows 로 명시한다. 두 박스가
            이제 같은 아홉 줄이라 키가 저절로 같지만, 줄을 나눠 두면 맺음말
            두 문구가 어느 경우에도 같은 선에서 시작한다. */}
        <Reveal delay={100} className="lg:col-span-7 lg:mt-20">
          <div className="relative grid grid-cols-2 grid-rows-[auto_auto_auto] gap-x-6 sm:gap-x-10">
            {/* VS. — 두 칸 사이 가운데에 절대 위치로 얹는다. */}
            <p
              aria-hidden
              className="absolute top-1 left-1/2 -translate-x-1/2 font-display text-fluid-lg font-bold text-foreground/30"
            >
              VS.
            </p>

            <p className="col-start-1 row-start-1 justify-self-center font-display text-fluid-lg font-bold tracking-tight text-foreground/45">
              타사
            </p>
            <p className="col-start-2 row-start-1 justify-self-center font-display text-fluid-lg font-bold tracking-tight text-foreground">
              다이버즈
            </p>

            {/* 타사 — 밝은 회색 칸. 처음 두 줄만 살아 있고 나머지 일곱은
                아이콘·글자를 함께 죽이고 오른쪽에 X를 붙인다. 취소선은
                쓰지 않는다 — 일곱 줄에 줄이 그어지면 지면이 시끄럽고,
                "안 한다"는 이미 흐림과 X 두 겹으로 말하고 있다. */}
            <div className="col-start-1 row-start-2 mt-8 overflow-hidden rounded-2xl bg-gray-100">
              {systemRows.map((row, i) => (
                <div
                  key={row.step}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3",
                    i !== systemRows.length - 1 &&
                      "border-b border-abyss/[0.06]",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-lg",
                      row.competitorCovers
                        ? "bg-white text-foreground/55 ring-1 ring-abyss/10"
                        : "bg-abyss/[0.04] text-foreground/20",
                    )}
                  >
                    <row.Icon aria-hidden strokeWidth={2} className="size-4" />
                  </span>
                  <span
                    className={cn(
                      "flex-1 text-[0.85rem] font-medium break-keep",
                      row.competitorCovers
                        ? "text-foreground/75"
                        : "text-foreground/25",
                    )}
                  >
                    {row.step}
                  </span>
                  {!row.competitorCovers && (
                    <X
                      aria-hidden
                      strokeWidth={2.5}
                      className="size-3.5 shrink-0 text-foreground/25"
                    />
                  )}
                  <span className="sr-only">
                    {row.competitorCovers ? "제공" : "미제공"}
                  </span>
                </div>
              ))}
            </div>

            {/* 다이버즈 — 아홉 줄 모두 살아 있다. 줄마다 체크를 붙이지 않는
                이유는, 아홉 줄이 전부 같은 표시라면 그건 정보가 아니라
                무늬가 되기 때문이다. 왼쪽 칸의 X 일곱 개가 대비를 이미
                만들고 있다. */}
            <div
              className={cn(
                "col-start-2 row-start-2 mt-8 overflow-hidden rounded-2xl",
                SOLUTION_BG,
              )}
            >
              {systemRows.map((row, i) => (
                <div
                  key={row.step}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3",
                    i !== systemRows.length - 1 && "border-b border-white/10",
                  )}
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#acd4ff] ring-1 ring-white/10">
                    <row.Icon aria-hidden strokeWidth={2} className="size-4" />
                  </span>
                  <span className="flex-1 text-[0.85rem] font-medium break-keep text-white/90">
                    {row.step}
                  </span>
                </div>
              ))}
            </div>

            <p className="col-start-1 row-start-3 mt-5 justify-self-center font-display text-fluid-base font-bold break-keep text-foreground/45">
              예약 전환 미비
            </p>
            <p className="col-start-2 row-start-3 mt-5 justify-self-center font-display text-fluid-base font-bold break-keep text-accent">
              예약 전환률 상승
            </p>
          </div>
        </Reveal>
      </div>

      {/* 외부 콘텐츠 넷. 위 WHY DIVERZ 가 "계정 안에서 도는 일"을 말했으니,
          여기서는 계정 바깥에서 검색과 후기를 만드는 갈래를 편다 — 패키지
          앞에 두는 이유는, 아래 패키지 이름(체험단 패키지, 왕홍 패키지)이
          바로 이 넷에서 나온 말이기 때문이다. 무엇인지 모른 채 값부터
          보면 패키지가 서로 뭐가 다른지 읽히지 않는다.

          제목 자리는 위아래 묶음과 같은 형식(BlockLabel + h4 + 본문,
          왼쪽 정렬)이다. */}
      <div className="section-gap">
        <BlockLabel>EXTERNAL CONTENT</BlockLabel>

        <Reveal delay={60}>
          <h4 className="mt-5 font-display text-fluid-2xl font-bold tracking-tight break-keep text-foreground">
            {contents.title}
          </h4>
        </Reveal>

        <Reveal delay={80}>
          <p className="mt-5 max-w-3xl text-fluid-base leading-[1.9] tracking-[-0.03em] break-keep text-foreground/80">
            {contents.body}
          </p>
        </Reveal>

        {/* 아래 패키지 카드와 같은 격자(4열)에 같은 모서리와 여백으로
            둔다 — 두 줄이 나란히 서는 자리라 카드 규격이 어긋나면 둘이
            다른 성격의 목록처럼 보인다.

            네 장이 모두 흰 칸으로 시작하고, 마우스를 얹은 한 장만 남색
            그라디언트(SOLUTION_BG)로 뒤집힌다. 한때 방문형 기자단 한 장을
            처음부터 어둡게 칠해 뒀는데, 넷은 고르는 선택지가 아니라 함께
            도는 갈래라 한 장만 미리 켜 두면 나머지 셋이 곁다리로 읽혔다.
            지금은 강조가 "어느 갈래가 더 중요한가"가 아니라 "지금 읽고
            있는 갈래"를 가리킨다. */}
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {contents.items.map((item, i) => (
            <Reveal as="li" key={item.name} delay={60 + i * 50}>
              {/* overflow-hidden — 사진이 카드 위쪽을 통째로 덮으므로,
                  둥근 모서리를 사진에도 그대로 물려야 한다. 그래서 안쪽
                  여백(p-7)은 카드가 아니라 글 상자가 들고 있다.

                  group — 뒤집히는 건 카드 하나지만 색이 바뀌는 건 그 안의
                  글 셋이라, 부모의 호버를 자식들이 같이 받아야 한다. */}
              <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_24px_50px_-28px_rgb(10_21_38/0.55)]">
                {/* 비율로 높이를 잡는다 — 네 장이 한 줄에 서므로 칸 폭이
                    변해도 사진 아랫선이 넷 다 같은 자리에 남아야 한다.
                    픽셀 높이로 못 박으면 좁은 화면에서 사진이 뭉툭해진다. */}
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  width={1024}
                  height={571}
                  sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 100vw"
                  className="aspect-[16/9] w-full object-cover"
                />

                <div className="relative flex flex-1 flex-col p-7">
                  {/* 남색 판을 글 뒤에 깔고 투명도만 여닫는다. 카드에
                      hover:bg-... 로 그라디언트를 직접 걸면 background-image
                      는 전이가 안 걸려 색이 툭 바뀐다. 사진 칸까지 덮지
                      않는 것도 일부러다 — 사진 위에 남색이 얹히면 무엇을
                      찍은 그림인지가 호버 중에 흐려진다. */}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                      SOLUTION_BG,
                    )}
                  />

                  <p className="relative text-fluid-xl font-bold tracking-tight break-keep text-foreground transition-colors duration-300 group-hover:text-white">
                    {item.name}
                  </p>

                  {/* flex-1 — 설명 길이가 카드마다 달라도 아래 맺음말이
                      네 장 모두 같은 선에 선다. */}
                  <p className="relative mt-3 flex-1 text-fluid-base leading-[1.6] break-keep text-foreground/65 transition-colors duration-300 group-hover:text-white/65">
                    {item.body}
                  </p>

                  {/* 맺음말 — 이 갈래가 결국 무엇을 남기는지. 위 설명과
                      성격이 달라(하는 일 vs 남는 것) 실선 하나로 가른다. */}
                  <p className="relative mt-6 border-t border-line pt-5 font-display text-fluid-base font-bold break-keep text-accent transition-colors duration-300 group-hover:border-white/15 group-hover:text-[#acd4ff]">
                    {item.effect}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>

      {/* 패키지. 금액을 지면에 적되, 조건은 금액 곁을 떠나지 않게 붙여 둔다. */}
      <div className="section-gap">
        <BlockLabel>PACKAGE</BlockLabel>

        <Reveal delay={60}>
          <h4 className="mt-5 font-display text-fluid-2xl font-bold tracking-tight break-keep text-foreground">
            {packages.title}
          </h4>
        </Reveal>

        <Reveal delay={80}>
          <p className="mt-5 max-w-3xl text-fluid-base leading-[1.9] tracking-[-0.03em] break-keep text-foreground/80">
            {packages.body}
          </p>
        </Reveal>

        {/* 4장을 한 줄에 놓는다(통합 패키지 포함) — 가격은 지금은 가린다.
            상담에서 안내하는 걸로 정리되면, 카드 아래 mt-auto 자리에
            item.price를 다시 꽂으면 된다. */}
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {packageCards.map((card, i) => (
            <Reveal as="li" key={card.key} delay={60 + i * 50}>
              <div
                className={cn(
                  "flex h-full flex-col gap-6 rounded-2xl border p-7 transition-all duration-300",
                  card.highlighted
                    ? cn(
                        /* 평평한 남색이 아니라 SOLUTION_BG(lib/theme.ts)
                           그라디언트다 — 이 사이트에서 "다이버즈 쪽"을
                           가리키는 칸은 모두 같은 남색 그라디언트를 쓴다
                           (위 유입 시스템 칸, 이커머스 탭의 NEEDS 카드와
                           PLAN 추천 카드). 여기만 단색이면 같은 급의
                           강조가 아니라 다른 종류의 칸으로 읽힌다.

                           테두리는 투명하게 둔다 — 그라디언트 위에 단색
                           테두리가 얹히면 좌상단에서 경계가 도드라진다.
                           호버도 바탕색 교체 대신 나머지 세 장과 같은
                           살짝 뜨기로 맞춘다(background-image 는 전이가
                           걸리지 않아 색이 툭 바뀐다). */
                        "border-transparent text-white hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgb(10_21_38/0.55)]",
                        SOLUTION_BG,
                      )
                    : "border-gray-200 bg-white text-foreground hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_24px_50px_-28px_rgb(10_21_38/0.3)]",
                )}
              >
                <div>
                  {card.popular && (
                    <p className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#acd4ff] px-3.5 py-1.5 text-sm font-bold tracking-[-0.01em] text-abyss">
                      <Star
                        aria-hidden
                        strokeWidth={2.5}
                        className="size-4 fill-current"
                      />
                      최우선 추천
                    </p>
                  )}
                  <p className="text-fluid-xl font-bold tracking-tight break-keep">
                    {card.name}
                  </p>
                  <p
                    className={cn(
                      "mt-2 text-fluid-base leading-[1.6] break-keep",
                      card.highlighted ? "text-white/65" : "text-foreground/65",
                    )}
                  >
                    {card.summary}
                  </p>
                </div>

                <ul className="flex-1 space-y-3">
                  {card.features.map((feature) => (
                    <li
                      key={feature}
                      className={cn(
                        "flex items-start gap-2 text-fluid-base leading-[1.5] break-keep",
                        card.highlighted
                          ? "text-white/85"
                          : "text-foreground/80",
                      )}
                    >
                      <BadgeCheck
                        aria-hidden
                        strokeWidth={2}
                        className={cn(
                          "mt-0.5 size-5 shrink-0",
                          card.highlighted ? "text-[#acd4ff]" : "text-accent",
                        )}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className={cn(
                    "group mt-auto inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-base font-bold tracking-tight transition-colors",
                    card.highlighted
                      ? "bg-[#acd4ff] text-abyss hover:bg-white"
                      : "bg-abyss text-white hover:bg-mid",
                  )}
                >
                  상담 문의
                  <ArrowRight
                    aria-hidden
                    strokeWidth={2.5}
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
