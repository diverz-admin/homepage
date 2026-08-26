import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Check, Star, X } from "lucide-react";

import Reveal from "@/components/reveal";
import { cn } from "@/lib/utils";
import { ecommerceMarketing } from "@/lib/site";
import { SOLUTION_BG } from "@/lib/theme";

/**
 * 글로벌 마케팅 대제목 아래로 매달리는 상품 — 중국 이커머스 입점 마케팅.
 *
 * 흐름은 제안서를 그대로 따른다.
 *
 *   후킹 → 이럴 때 필요하다(NEEDS)
 *   → 직접 입점 대비 비교(COMPARISON)
 *   → 플랜(PLAN) → 닫는 한 줄
 *
 * 이 상품은 파는 주체가 둘이다 — 입점 인프라는 파트너사, 마케팅은 다이버즈.
 * 지면에서 파트너사는 이름 대신 "입점 인프라 파트너"라는 역할로만 부른다
 * (lib/site.ts의 ecommerceMarketing 주석 참고).
 *
 * 색은 흰 지면 위에서는 역할 토큰(text-foreground 등)을 쓰고, 어두운 칸
 * 안에서만 절대 팔레트(bg-abyss·text-white)를 쓴다. 그 안쪽은 이 페이지의
 * .on-light 반전이 닿지 않는 자리라, 토큰을 그대로 쓰면 글자가 배경에 묻는다.
 */

/**
 * 덩어리 머리에 놓는 영문 라벨.
 * hospital-marketing.tsx의 같은 이름 컴포넌트와 규격을 맞춘다 — 두 상품이
 * 탭으로 나란히 서므로 묶음 머리의 격식이 달라지면 안 된다.
 */
function BlockLabel({ children }: { children: React.ReactNode }) {
  return (
    <Reveal>
      <p className="font-display text-xs font-bold tracking-[0.3em] text-accent">
        {children}
      </p>
    </Reveal>
  );
}

/** 묶음 머리 — 라벨 + 제목 + (있으면) 설명. 아래 여섯 묶음이 모두 이 꼴이다. */
function BlockHead({
  label,
  title,
  body,
}: {
  label: string;
  title: string;
  body?: string;
}) {
  return (
    <>
      <BlockLabel>{label}</BlockLabel>
      <Reveal delay={60}>
        <h4 className="mt-5 font-display text-fluid-2xl font-bold tracking-tight break-keep whitespace-pre-line text-foreground">
          {title}
        </h4>
      </Reveal>
      {body && (
        <Reveal delay={80}>
          <p className="mt-5 max-w-3xl text-fluid-base leading-[1.9] tracking-[-0.03em] break-keep text-foreground/80">
            {body}
          </p>
        </Reveal>
      )}
    </>
  );
}

/**
 * 문장마다 줄을 바꿔 주는 본문.
 *
 * 카드 안 설명은 두 문장짜리가 많은데(예: "목표와 KPI에 맞춰 매체를
 * 구성합니다. 샤오홍슈, 도우인, 위챗, 웨이보, 바이두를 다룹니다."), 폭이
 * 좁아지면 두 번째 문장의 첫 낱말이 첫 줄 끝에 매달려 문장이 어디서
 * 끝났는지 눈으로 잡히지 않는다. 마침표 뒤에서 줄을 끊으면 좁은 화면에서도
 * 문장 단위로 읽힌다.
 *
 * 넓은 화면에서는 어차피 문장마다 한 줄씩 앉으므로 보이는 차이가 없다.
 * 마침표+공백만 끊는다 — 문장 안의 "5 / 영상 10" 같은 자리는 건드리지
 * 않는다.
 */
function Sentences({ text }: { text: string }) {
  return (
    <>
      {text.split(/(?<=\.)\s+/).map((sentence) => (
        <span key={sentence} className="block">
          {sentence}
        </span>
      ))}
    </>
  );
}

/** 묶음 아래 붙는 단서 한 줄. 금액·기간처럼 조건이 붙는 값 곁을 떠나지 않는다. */
function BlockNote({ children }: { children: React.ReactNode }) {
  return (
    <Reveal delay={80}>
      <p className="mt-6 max-w-3xl text-fluid-sm leading-[1.7] break-keep text-foreground/45">
        ※ {children}
      </p>
    </Reveal>
  );
}

/**
 * 단계 머리 — STAGE 01(입점) / STAGE 02(마케팅)를 가르는 표지.
 *
 * 이 상품은 파는 주체가 둘이라(입점 인프라 파트너 / 다이버즈) 어느 구간을
 * 누가 맡는지가 지면에서 가장 먼저 잡혀야 한다. 그래서 묶음 라벨
 * (NEEDS·COMPARISON …)보다 한 급 위에, 단계 이름과 담당을 같이 세운다.
 * 담당 배지를 빼면 아래 여섯 묶음이 다시 한 덩어리로 읽힌다.
 */
function StageHead({
  no,
  name,
  owner,
  body,
  items,
  isDiverz = false,
}: {
  no: string;
  name: string;
  owner: string;
  body: string;
  items: readonly string[];
  /**
   * 다이버즈가 맡는 단계인가. 담당 업무 상자의 바탕을 가른다 —
   * 파트너 몫은 회색, 다이버즈 몫은 남색 그라디언트(SOLUTION_BG).
   * 이 지면에서 가장 먼저 잡혀야 하는 게 "누가 무엇을 하는가"인데
   * (lib/site.ts의 stages 주석), 글로 적힌 owner 알약 하나만으로는
   * 두 단계를 훑을 때 눈에 걸리지 않는다. 색이 같은 말을 한 번 더 한다.
   * 회색 대 남색은 이 페이지가 이미 쓰는 문법이다 — 비교표의 두 칸,
   * NEEDS 카드의 걱정·해결, 병원 탭의 타사·다이버즈가 모두 같은 짝이다.
   */
  isDiverz?: boolean;
}) {
  return (
    <div className="section-gap">
      {/* 제목 묶음은 위에 한 줄로 세우고, 공정은 그 아래 지면 폭을 다 쓴다.
          예전에는 6:6 두 단이라 공정 상자가 오른쪽 절반에만 들어갔고,
          왼쪽 아래가 통째로 비어 상자가 지면에서 떠 보였다. */}
      <div className="max-w-3xl">
        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-abyss px-3.5 py-1.5 font-display text-xs font-bold tracking-[0.2em] text-white">
              {no}
            </span>
            <span className="rounded-full border border-accent/40 px-3.5 py-1.5 text-sm font-bold tracking-tight text-accent">
              {owner}
            </span>
          </div>
        </Reveal>
        <Reveal delay={60}>
          <h4 className="mt-5 font-display text-fluid-2xl font-bold tracking-tight break-keep text-foreground">
            {name}
          </h4>
        </Reveal>
        <Reveal delay={80}>
          <p className="mt-4 text-fluid-base leading-[1.9] tracking-[-0.03em] break-keep text-foreground/80">
            {body}
          </p>
        </Reveal>
      </div>

      {/* 담당 업무는 순서다 — 입점 → 상품 등록 → 주문/재고 → 물류/통관 →
          정산/CS 로 이어진다. 그래서 항목을 늘어놓지 않고 공정으로 세운다.
          넓은 화면에서는 다섯 칸을 가로로 눕히고 번호와 번호를 실선으로
          잇는다. 지면 폭을 다 쓰므로 한 단계에서 다음 단계로 넘어가는
          거리가 눈에 보인다.

          좁은 화면(lg 미만)에서는 세로로 접힌다 — 다섯 칸을 억지로 가로로
          두면 "정산 / 현지 CS 지원" 같은 긴 항목이 서너 줄로 접힌다.
          그때는 선을 긋지 않는다(가로선이 세로 배치에서 어긋난다).

          접힌 판형에서는 번호와 글을 한 줄에 나란히 둔다. lg 의 세로
          배치(번호 위 / 글 아래)를 그대로 물려받으면 한 항목이 두 줄을
          쓰면서 다섯 줄이 화면 한 장을 통째로 먹었다 — 다섯은 훑고
          지나가는 목록이지 한 줄씩 읽는 본문이 아니다. 번호 구슬도
          한 급 줄이고(44 → 36px) 상자 여백과 줄 간격을 함께 좁힌다.

          바탕(흰 칸 대 남색)은 담당을 색으로 한 번 더 말한다 — 비교표의
          두 칸, NEEDS 카드의 걱정/해결과 같은 짝이다. 파트너 몫은 예전에
          회색(bg-gray-100)이었는데, 지면이 이미 흰색이라 회색 판이 "덜
          중요한 칸"처럼 가라앉아 보였다. 흰 칸 + 실선 테두리로 바꾸면
          두 단계가 같은 격으로 서고, 남색과의 대비도 그대로 남는다
          (이 지면의 카드들이 이미 쓰는 꼴이다 — border-gray-200 bg-white). */}
      <Reveal delay={100}>
        <ol
          className={cn(
            "mt-10 grid gap-5 rounded-2xl px-5 py-7 sm:grid-cols-2 sm:gap-7 sm:px-10 sm:py-9 lg:mt-12 lg:grid-cols-5 lg:gap-6 lg:px-12 lg:py-12",
            isDiverz
              ? SOLUTION_BG
              : "border border-gray-200 bg-white shadow-[0_24px_50px_-34px_rgb(10_21_38/0.25)]",
          )}
        >
          {items.map((item, i) => (
            <li
              key={item}
              className="relative flex items-center gap-3.5 lg:flex-col lg:items-stretch lg:gap-4"
            >
              {/* 다음 번호로 잇는 선. 배지 한가운데(top-[22px]) 높이에서
                  배지 오른쪽 끝(left-14)부터 칸 끝을 지나 다음 칸 배지까지
                  긋는다 — 칸 사이 간격(lg:gap-6 = 24px)만큼 -right 로
                  넘겨야 선이 끊기지 않는다. */}
              {i !== items.length - 1 && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-[22px] right-[-1.5rem] left-14 hidden h-px lg:block",
                    isDiverz ? "bg-white/15" : "bg-abyss/10",
                  )}
                />
              )}
              <span
                className={cn(
                  /* 남색 판 위에서는 흰 원에 테두리를 두르지 않는다 —
                     바탕이 어두워 흰 면 자체가 이미 또렷하고, 거기에 선까지
                     얹으면 배지가 두 겹으로 읽힌다. 글자는 #acd4ff 가 아니라
                     abyss 로 뒤집는다(그 하늘색은 남색 위에서 쓰라고 고른
                     색이라 흰 바탕에서는 대비가 안 난다).
                     회색 판 쪽은 흰 원과 바탕이 가까워 테두리를 남긴다. */
                  "relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full font-display text-[0.75rem] font-bold tabular-nums lg:size-11 lg:text-[0.8rem]",
                  isDiverz
                    ? "bg-white text-abyss"
                    : "bg-white text-accent ring-1 ring-abyss/15",
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={cn(
                  "text-fluid-base leading-[1.45] font-semibold break-keep",
                  isDiverz ? "text-white/90" : "text-foreground/85",
                )}
              >
                {item}
              </span>
            </li>
          ))}
        </ol>
      </Reveal>
    </div>
  );
}

export default function EcommerceMarketing() {
  const {
    platforms,
    hook,
    title,
    summary,
    stages,
    needs,
    comparison,
    plans,
    marketing,
  } = ecommerceMarketing;

  return (
    <section>
      {/* 후킹 + 개념도를 한 줄에 나란히 둔다.
          글은 왼쪽 정렬로 내리고, 오른쪽 칸에 "일반 방식 vs 다이버즈 방식"
          그림을 붙인다 — 제목이 말로 하는 얘기("직접 하면 전부 떠안는다")를
          바로 옆에서 그림이 받아 주니, 문장을 다 읽기 전에 구조가 먼저 눈에
          들어온다.

          상품 이름표는 두지 않는다 — 바로 위 탭(ChipTabs)에 이미 같은 문구가
          떠 있어서, 그 아래 한 번 더 적으면 같은 말을 두 번 한다.

          그림이 가로로 넓어(1782x892) 오른쪽에 더 넓은 몫(7/12)을 준다.
          좁은 화면에서는 두 칸이 위아래로 쌓이고 글은 그대로 왼쪽 정렬로
          남는다 — 이 지면에서 가운데 정렬로 되돌릴 이유가 없다.

          세로는 두 줄로 나눈다. 1행은 왼쪽 5칸에 칩·후킹만 놓고 오른쪽을
          비워 두고, 2행에 제목+설명과 그림을 나란히 세운다 — 그리드 행은
          윗변이 저절로 맞으니, 그림 윗변이 제목 첫 줄과 같은 높이에 선다.
          한 덩어리로 묶고 items-start 만 걸면 그림이 칩 줄까지 올라가고,
          거꾸로 마진으로 내리려면 그 값이 후킹 줄 수·화면 폭마다 달라져
          어느 폭에 맞춰도 다른 폭에서 어긋난다.

          gap-y-3(12px)이 1행과 2행 사이, 곧 후킹→제목 간격이다.
          한 단으로 쌓이는 좁은 화면에서는 그림만 mt-12 를 더해 앞 글
          묶음과 확실히 떨어뜨린다. */}
      <div className="grid grid-cols-1 gap-x-10 gap-y-3 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-5 lg:col-start-1 lg:row-start-1">
          {/* 채널 로고 — 이 상품이 닿는 중국 플랫폼을 문장보다 먼저 보여 준다.
              알약(흰 칩 + 링)을 걷고 로고만 지면에 얹는다. 아래 키워드 알약과
              모양이 겹쳐 어느 쪽이 키워드인지 흐려졌다.

              이름을 함께 적지 않는다 — 넷 다 알아볼 수 있는 앱 아이콘이고,
              바로 아래 문장이 "중국 입점"이라 맥락도 이미 잡혀 있다. 대신
              alt 에 이름을 남겨 스크린 리더와 이미지 미표시 상황을 받는다.

              크기는 파일 쪽에서 이미 맞춰 뒀다 — 받은 원본은 아이콘이
              차지하는 비율이 17~100%로 제각각이라 같은 픽셀로 렌더하면
              틱톡만 작아 보였다(scripts/normalize-china-platform-logos.mjs). */}
          <Reveal delay={20}>
            <ul className="flex flex-wrap items-center gap-3.5">
              {platforms.map((platform) => (
                <li key={platform.name}>
                  <Image
                    src={platform.src}
                    alt={platform.name}
                    width={256}
                    height={256}
                    sizes="36px"
                    className="size-9 object-contain"
                  />
                </li>
              ))}
            </ul>
          </Reveal>

          {/* 제목 위 공감 한 줄. 영문 라벨(NEEDS·COMPARISON …)과 같은 자리에
              서지만 성격이 다르다 — 저쪽은 묶음 이름표라 작게 흘리고, 이건
              읽는 사람의 마음을 먼저 받아 주는 문장이라 제목 바로 아래
              급으로 세운다. 액센트 색으로 제목과 무게를 가른다. */}
          <Reveal delay={40}>
            <p className="mt-6 text-fluid-lg font-bold tracking-[-0.02em] break-keep text-accent">
              {hook}
            </p>
          </Reveal>
        </div>

        {/* 제목 + 설명 — 2행 1열. 옆 칸 그림과 같은 행이라 제목 첫 줄과
            그림 윗변이 맞는다. 제목에 mt 를 두지 않는 게 핵심이다 —
            행 간격(gap-y-3)이 후킹과의 사이를 맡고, 여기에 마진을 더하면
            그만큼 그림과 윗변이 다시 어긋난다. */}
        <div className="lg:col-span-5 lg:col-start-1 lg:row-start-2">
          <Reveal delay={60}>
            <h3
              style={{ lineHeight: 1.15 }}
              className="font-display text-fluid-2xl font-bold tracking-tight whitespace-pre-line break-keep text-foreground"
            >
              {title}
            </h3>
          </Reveal>

          <Reveal delay={80}>
            <p className="mt-6 text-fluid-lg leading-[1.85] font-normal tracking-[-0.04em] break-keep text-foreground/85">
              {summary}
            </p>
          </Reveal>
        </div>

        {/* 개념도 — 2행 6~12열. 제목 묶음과 같은 행이라 윗변이 맞는다.
            흰 배경으로 구워진 그림이라 지면에 그대로 얹는다.

            (그림 파일 자체가 위쪽에 높이의 5.4%를 여백으로 물고 있어
            "일반 방식" 글자는 상자보다 15~20px 아래에서 시작한다. 그만큼을
            음수 마진으로 걷어내지는 않는다 — 그림 높이가 칸 폭을 따라
            변해서 어느 폭에 맞춰도 다른 폭에서 어긋난다.) */}
        <Reveal
          delay={100}
          className="mt-12 lg:col-span-7 lg:col-start-6 lg:row-start-2 lg:mt-0"
        >
          <Image
            src="/images/service/global/ecommerce-structure-v3.png"
            alt="일반 방식은 브랜드가 상품관리/플랫폼등록/주문관리/국제물류/통관/현지배송/정산까지 모두 직접 맡지만, 다이버즈의 통합 입점+마케팅 솔루션은 이커머스 판매 인프라와 인플루언서 마케팅 두 갈래로 묶어 중국 소비자까지 연결한다"
            width={1782}
            height={892}
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="h-auto w-full"
          />
        </Reveal>
      </div>

      <StageHead {...stages[0]} />

      {/* NEEDS — 첫 소구포인트. 비용 얘기(COST)보다 먼저 "이럴 때 필요하다"를
          세운다. */}
      <div className="section-gap">
        <BlockHead label="NEEDS" title={needs.title} body={needs.body} />

        {/* 카드 한 장이 "걱정 → 해결"로 갈린다. 왼쪽 밝은 칸은 브랜드가 이미
            품고 있는 걱정, 오른쪽 어두운 칸은 다이버즈가 내놓는 답이다.
            예전에는 한 칸 안에 제목(걱정)·본문(해결)·태그(결과)를 세로로
            쌓아 뒀는데, 셋이 같은 바탕 위에 있어서 어디까지가 문제이고
            어디부터가 답인지 눈으로 갈리지 않았다. 바탕색을 가르면 한 장에서
            두 마디가 읽힌다 — 데이터(lib/site.ts)도 이미 그 셋으로 나뉘어
            있어서 화면이 데이터 모양을 그대로 따라간다.

            세 칸에서 두 칸(lg:grid-cols-2)으로 줄인다 — 좌우로 가르는 카드를
            세 칸에 밀어 넣으면 한쪽이 200px 아래로 눌려 문장이 글자 단위로
            깨진다. 좁은 화면(sm 미만)에서는 좌우가 위아래로 쌓인다. */}
        <ul className="mt-12 grid gap-5 lg:grid-cols-2">
          {needs.items.map((item, i) => {
            return (
              <Reveal as="li" key={item.no} delay={60 + i * 50}>
                <div className="group grid h-full overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-24px_rgb(10_21_38/0.35)] sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
                  {/* 걱정 — 흰 칸. 번호와 한 마디만 세로 가운데에 남긴다.
                      아이콘 칩은 걷었다 — 여섯 장의 아이콘이 서로 비슷한
                      선 그림이라 무엇을 가리키는지 오히려 헷갈렸고, 번호가
                      이미 카드를 세는 표식 노릇을 하고 있었다. 그 번호를
                      구석의 배경 무늬에서 글 위로 끌어올려 아이콘 자리를
                      대신하게 한다.

                      지면과 같은 흰색이라 테두리가 없으면 이 칸이 통째로
                      사라지고 오른쪽 남색 반쪽만 떠 보인다. ring-inset 으로
                      이 칸에만 윤곽을 두른다 — 카드 전체에 두르면 남색 위로도
                      옅은 선이 지나가고, 여기에 두르면 오른쪽 변이 두 바탕
                      사이의 경계선 노릇을 겸한다(좁은 화면에서 위아래로
                      쌓이면 그 자리가 아래 변으로 옮겨 가며 같은 일을 한다).

                      숫자는 지면 색(abyss)을 18%까지 낮춘 회색이다 — 제목보다
                      뒤에 서되, 배경 무늬로 사라지지는 않는 농도다. 크기를
                      줄이면 같은 농도라도 획이 가늘어져 더 흐려 보이므로,
                      농도는 그만큼 올려 잡는다. */}
                  <div className="relative flex flex-col justify-center gap-5 bg-white p-7 ring-1 ring-gray-200 ring-inset sm:p-8">
                    <span
                      aria-hidden
                      className="relative font-display text-[2rem] leading-none font-bold text-abyss/[0.18] tabular-nums"
                    >
                      {item.no}
                    </span>

                    <p className="relative text-fluid-lg font-bold tracking-tight break-keep text-foreground">
                      {item.title}
                    </p>

                    {/* 이음새 화살표 — 두 칸이 "문제 → 답"으로 이어진다는
                        표시. 왼쪽 칸의 오른쪽 끝에 걸터앉아 두 바탕을 반씩
                        밟는다(카드의 overflow-hidden 은 카드 바깥만 자르므로
                        가운데에 걸친 이 배지는 잘리지 않는다).
                        한 단으로 쌓이는 구간에서는 이음새가 세로가 아니라
                        가로줄이라 이 자리가 없어 감춘다. */}
                    <span
                      aria-hidden
                      className="absolute top-1/2 -right-4 z-10 hidden size-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#acd4ff] text-abyss shadow-[0_2px_10px_rgb(10_21_38/0.25)] sm:flex"
                    >
                      <ArrowRight strokeWidth={2.5} className="size-4" />
                    </span>
                  </div>

                  {/* 해결 — 어두운 칸. 태그(결과)를 제목 자리로 올리고 그
                      아래에 어떻게 없어지는지를 푼다. 이 안쪽은 .on-light
                      반전이 닿지 않아 역할 토큰 대신 절대 팔레트를 쓴다. */}
                  <div
                    className={cn(
                      "flex flex-col justify-center p-7 text-white sm:p-8",
                      SOLUTION_BG,
                    )}
                  >
                    <p className="text-fluid-lg font-bold tracking-tight break-keep text-white">
                      {item.tag}
                    </p>
                    <p className="mt-3 text-svc-body leading-[1.8] break-keep text-white/65">
                      {item.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>

      {/* COMPARISON — 조건을 줄 단위로 견준다.
          제목을 왼쪽에 세우고 표를 오른쪽에 붙인다. 표가 지면 폭을 다 쓰면
          한 줄이 길어져 어느 값이 어느 칸 것인지 눈이 놓친다.

          5:7 로 나눈다(예전 4:8). 8칸일 때 표가 880px까지 자랐는데, 가장 긴
          값이 184px밖에 안 돼서 어느 칸에서든 글자 뒤로 빈자리가 길게
          남았다 — 값과 값 사이가 벌어지면 줄을 눈으로 좇아야 한다.
          7칸(약 650px)이면 가장 긴 값("있음 (더우인 $5,000 이상 판매 후)"
          184px + 아이콘·여백 52px = 236px, 39% 칸의 최소 필요 폭 605px)이
          여전히 한 줄로 앉으면서 세 칸이 한눈에 들어온다.
          폭을 max-width 로 조이지 않고 칸 수로 줄인 이유는, 표가 지면
          오른쪽 끝에 그대로 붙어 있어야 지면 오른쪽 기준선과 맞기
          때문이다.

          lg:items-start — 제목이 표 높이를 따라 세로 가운데로 밀리면 안 된다. */}
      <div className="section-gap grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
        <div className="lg:col-span-5">
          <BlockHead
            label="COMPARISON"
            title={comparison.title}
            body={comparison.body}
          />
        </div>

        {/* min-w-0 — 이게 없으면 좁은 화면에서 표가 아니라 페이지가 옆으로
            밀린다. 그리드 칸의 기본 최소 폭은 auto 라, 안에 든 표의
            min-w-[520px] 가 칸의 최소 폭으로 그대로 올라온다. 그러면
            아래 overflow-x-auto 상자가 화면보다 넓어져 스크롤이 걸릴 일이
            없어지고, 대신 지면 전체에 가로 스크롤이 생긴다(390px 화면에서
            문서 폭이 552px로 잰다). 최소 폭을 0으로 풀어야 칸이 화면에
            맞춰 줄고, 넘치는 몫을 표가 자기 안에서 긁는다. */}
        <Reveal delay={80} className="min-w-0 lg:col-span-7 lg:mt-20">
          {/* 좁은 화면에서는 가로로 긁는다 — 세 칸을 억지로 접으면 어느 값이
              어느 쪽 것인지 흐려진다.

              칸 너비를 colgroup 으로 못 박는다. 브라우저에 맡기면 글자가 긴
              "브랜드샵 직접 입점" 칸이 폭을 다 가져가, 값과 다이버즈 칸
              사이가 크게 벌어진다.

              항목명(구분) 칸은 표 왼쪽 끝이 아니라 가운데(20%)에 두고,
              글도 이 칸만 가운데 정렬한다 — 왼쪽에 세우면 세 칸이
              "이름 · 남 · 우리" 순으로 읽혀 견주는 두 쪽이 한쪽으로
              몰리는데, 가운데에 두면 항목명이 축이 되고 직접 입점(왼쪽)과
              다이버즈(오른쪽)가 그 축을 사이에 두고 마주 본다.
              "정산 주기"·"보세 창고"처럼 가장 긴 항목명도 두세 글자 넘지
              않아 22%면 넉넉하다.

              견주는 두 칸은 일부러 폭을 다르게 준다 — 직접 입점 34%,
              다이버즈 46%. 예전에는 39%씩 똑같이 나눴는데, 그러면 이 표의
              결론(다이버즈 칸)이 옆 칸과 같은 무게로 읽혔다. 넓은 칸 +
              한 급 큰 글자(값 text-fluid-base·굵게, 머리 text-fluid-lg)로
              세 칸 중 가장 먼저 눈에 들어오게 하고, 직접 입점 쪽은 한 급
              내려(text-fluid-sm) 참고 값으로 물러나게 한다.
              46%면 이 칸에서 가장 긴 값("상품별 최적화 창고/물류 지원")이
              1024px에서도 한 줄로 앉는다 — 결론 칸에 줄바꿈이 생기면
              키운 효과가 그대로 상쇄된다. 반대로 직접 입점 칸의 가장 긴 값
              ("있음 (더우인 $5,000 이상 판매 후)")은 1280px 아래에서 두 줄이
              되는데, 이건 폭을 39%로 두었을 때도 마찬가지였다.

              다이버즈 칸은 남색 그라디언트(SOLUTION_BG)를 채워 "이쪽이 답"
              이라는 걸 표 톤만으로 보여 준다 — NEEDS 카드의 해결 칸과 같은
              바탕이라 한 지면 안에서 같은 문법으로 읽힌다. O/X 아이콘을 값 앞에 붙여
              글자를 읽기 전에도 방향이 먼저 잡히게 한다 — 병원 마케팅의
              타사 VS 다이버즈 O/X 문법과 같은 규칙이다. 바깥 상자의
              overflow-hidden 이 어두운 배경을 둥근 모서리에 맞춰 잘라 준다.

              안쪽 여백은 세 칸 모두 px-4 로 같다. 가운데 정렬로 바꾼 뒤로는
              좌우를 다르게 줄 이유가 없다 — 값이 칸 가운데에 서므로 한쪽만
              넓혀도 글자가 그만큼 반대로 밀릴 뿐이다. */}
          <div className="overflow-x-auto px-1 py-7">
            {/* 다이버즈 칸 바탕(그라디언트)은 칸마다가 아니라 표 전체
                  높이에 한 번만 깐다. td 마다 그라디언트를 주면 줄마다
                  처음부터 다시 그려져 여덟 줄이 여덟 개의 띠로 끊긴다.

                  표를 감싼 이 상자 안에서 절대 위치로 오른쪽 46%(colgroup의
                  다이버즈 칸 폭)를 덮는다. 상자를 스크롤 컨테이너 바깥이
                  아니라 안쪽에 두고 min-w 를 넘겨받게 한 건, 좁은 화면에서
                  표가 가로로 밀릴 때 바탕도 같이 밀려야 하기 때문이다 —
                  바깥에 두면 표만 움직이고 바탕은 제자리에 남는다.

                  색은 NEEDS 카드와 같은 SOLUTION_BG(lib/theme.ts). */}
            {/* 최소 폭은 sm 부터만 건다. 그 아래(휴대폰)에서는 표를 화면
                폭에 맞춰 접는다 — 520px 를 그대로 물리면 342px 화면에서
                결론 칸(다이버즈)이 거의 통째로 오른쪽 밖에 남아, 옆으로
                긁어야 한다는 걸 모르면 표가 잘린 것으로 보인다. 세 칸을
                접으면 값이 두세 줄로 나뉘지만, 여덟 줄 전부가 한눈에
                보이는 쪽이 낫다. sm 이상에서는 예전 그대로다. */}
            <div className="relative sm:min-w-[520px]">
              <div
                aria-hidden
                className={cn(
                  "pointer-events-none absolute -top-7 -bottom-7 right-0 w-[42%] rounded-[20px] shadow-[0_30px_60px_-32px_rgb(10_21_38/0.65)]",
                  SOLUTION_BG,
                )}
              />
              <div className="relative overflow-hidden rounded-2xl">
                <table className="relative w-full border-collapse text-center">
                  {/* 접히는 폭에서는 앞 두 칸의 몫을 다시 나눈다 — 항목명
                      ("입점 소요 기간")이 20%(67px)에서 석 줄로 쪼개진다.
                      결론 칸(42%)은 건드리지 않는다: 아래 그라디언트 판이
                      같은 42%로 깔려 있어 둘이 어긋나면 안 된다. */}
                  <colgroup>
                    <col className="w-[32%] sm:w-[38%]" />
                    <col className="w-[26%] sm:w-[20%]" />
                    <col className="w-[42%]" />
                  </colgroup>
                  {/* 머리줄은 한 급 키우고(text-fluid-base) 칸 가운데에 세운다.
                    아래 값 칸도 같이 가운데로 모은다 — 머리만 가운데로
                    보내면 그 아래 값이 왼쪽에 붙어 세로 축이 어긋난다.
                    값 칸은 아이콘(O/X)까지 한 덩어리로 묶어 가운데에 세운다
                    (span 의 justify-center) — 아이콘을 칸 왼쪽에 고정하면
                    글자만 가운데로 가서 둘이 따로 논다. */}
                  {/* 바탕은 줄(머리/본문)이 아니라 칸(세로)으로 나뉜다 —
                    브랜드샵 직접 입점은 회색, 구분은 흰색, 다이버즈는
                    딥네이비. 머리줄에만 회색 띠를 두르던 예전 방식과 달리
                    세 칸이 위에서 아래까지 제 색을 이어 가서, 어느 값이
                    어느 쪽 것인지 줄을 눈으로 좇지 않아도 잡힌다.
                    머리줄은 아래 테두리(border-b)와 글자 색으로 가른다. */}
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="bg-gray-100 px-2 py-5 text-center sm:px-4 text-fluid-base font-bold break-keep text-foreground/45">
                        브랜드샵 직접 입점
                      </th>
                      <th className="bg-white px-2 py-5 text-center sm:px-4 text-fluid-base font-bold break-keep text-foreground/45">
                        구분
                      </th>
                      {/* 바탕은 아래 그라디언트가 맡는다 — 여기서 bg 를 주면
                        그 줄만 단색으로 덮인다.

                        칸 이름은 "다이버즈"가 아니라 "입점 인프라 파트너"다.
                        이 표가 견주는 건 입점 방식이라, 다이버즈를 세우면
                        보세창고와 통관까지 우리가 하는 것으로 읽힌다. */}
                      <th className="px-2 py-5 text-center sm:px-4 text-fluid-lg font-bold break-keep text-[#acd4ff]">
                        입점 인프라 파트너
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.rows.map((row) => (
                      <tr
                        key={row.label}
                        className="border-b border-gray-100 last:border-b-0"
                      >
                        {/* 아이콘을 flex 형제가 아니라 글의 첫 글자 앞에
                            끼워 넣는다(inline-block). flex 로 나란히 두면
                            값이 두 줄로 접힐 때 글 상자가 칸을 꽉 채우면서
                            아이콘만 왼쪽 끝으로 떨어져 나가고, 둘째 줄은
                            그 상자 안에서만 가운데로 서서 지면의 가운데와
                            어긋난다("상품별 최적화 창고/물류 / 지원"이
                            그렇게 깨졌다). 글의 일부가 되면 아이콘과 글이
                            한 덩어리로 접히고 줄마다 가운데가 맞는다.

                            text-balance — 두 줄로 넘어갈 때 길이를 고르게
                            나눈다. 첫 줄이 꽉 차고 마지막 한 낱말만 다음
                            줄에 남는 걸 막는다. */}
                        <td className="bg-gray-100 px-2 py-4 text-center align-middle sm:px-4">
                          <span className="text-fluid-sm leading-[1.6] break-keep text-balance text-foreground/50">
                            <X
                              aria-hidden
                              strokeWidth={2.5}
                              className="mr-1.5 inline-block size-3.5 align-[-0.15em] text-foreground/25"
                            />
                            {row.direct}
                          </span>
                        </td>
                        <td className="bg-white px-2 py-4 text-center align-middle text-svc-body font-bold break-keep text-balance text-foreground/60 sm:px-4">
                          {row.label}
                        </td>
                        <td className="px-2 py-4 text-center align-middle sm:px-4">
                          <span className="text-fluid-base leading-[1.6] font-semibold break-keep text-balance text-white">
                            <Check
                              aria-hidden
                              strokeWidth={2.5}
                              className="mr-2 inline-block size-4 align-[-0.15em] text-[#acd4ff]"
                            />
                            {row.alink}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* 테두리는 표 전체가 아니라 왼쪽 두 칸에만 두른다. 상자에
                  통째로 두르면 그 선이 다이버즈 카드 위를 가로질러, 카드가
                  표 안에 갇힌 것처럼 보인다 — 카드는 표보다 위아래로 더
                  커야 한다. 오른쪽 변(border-r-0)은 카드가 대신 맡는다. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 right-[42%] rounded-l-2xl border border-r-0 border-gray-200"
              />
            </div>
          </div>
        </Reveal>
      </div>

      {/* PLAN — 플랜별로 무엇이 들어가는지만 세운다. 금액은 띄우지 않는다. */}
      <div className="section-gap">
        <BlockHead label="PLAN" title={plans.title} />

        <ul className="mt-12 grid gap-5 lg:grid-cols-3">
          {plans.items.map((plan, i) => (
            <Reveal as="li" key={plan.name} delay={60 + i * 50}>
              <div
                className={cn(
                  "flex h-full flex-col gap-6 rounded-2xl border p-7 transition-all duration-300",
                  /* 추천 카드 바탕은 NEEDS 카드·COMPARISON 표와 같은
                     SOLUTION_BG(lib/theme.ts). 호버로 바탕색을 바꾸던
                     hover:bg-[#0d1c33]는 걷었다 — 그라디언트 위에 단색을
                     얹으면 그때만 결이 사라져 다른 카드처럼 보인다.
                     대신 흰 카드와 같은 방식(떠오르기 + 그림자)으로 반응한다. */
                  plan.recommended
                    ? cn(
                        "border-transparent text-white hover:-translate-y-1 hover:shadow-[0_28px_60px_-24px_rgb(10_21_38/0.55)]",
                        SOLUTION_BG,
                      )
                    : "border-gray-200 bg-white text-foreground hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_24px_50px_-28px_rgb(10_21_38/0.3)]",
                )}
              >
                <div>
                  {plan.recommended && (
                    <p className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#acd4ff] px-3.5 py-1.5 text-sm font-bold tracking-[-0.01em] text-abyss">
                      <Star
                        aria-hidden
                        strokeWidth={2.5}
                        className="size-4 fill-current"
                      />
                      추천
                    </p>
                  )}
                  <p className="text-fluid-xl font-bold tracking-tight break-keep">
                    {plan.name}
                  </p>
                  <p
                    className={cn(
                      "mt-3 text-fluid-base leading-[1.6] break-keep",
                      plan.recommended ? "text-white/65" : "text-foreground/65",
                    )}
                  >
                    {plan.summary}
                  </p>
                </div>

                <ul className="flex-1 space-y-3">
                  {plan.includes.map((feature) => (
                    <li
                      key={feature}
                      className={cn(
                        "flex items-start gap-2 text-fluid-base leading-[1.5] break-keep",
                        plan.recommended
                          ? "text-white/85"
                          : "text-foreground/80",
                      )}
                    >
                      <BadgeCheck
                        aria-hidden
                        strokeWidth={2}
                        className={cn(
                          "mt-0.5 size-5 shrink-0",
                          plan.recommended ? "text-[#acd4ff]" : "text-accent",
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
                    plan.recommended
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

        <BlockNote>{plans.note}</BlockNote>
      </div>

      <StageHead {...stages[1]} isDiverz />

      {/* JOURNEY — 구매 경로 두 갈래(제안서 p17)와 그 경로를 맡는 플랫폼
          (제안서 p18)을 한 묶음으로 세운다.

          예전에는 JOURNEY와 PLATFORM이 따로 선 두 묶음이었는데, 둘은 사실
          같은 말을 앞뒤에서 하고 있었다 — 신뢰 기반(후기/검색) 경로가
          일어나는 곳이 샤오홍슈고, 전환 기반(라이브커머스) 경로가 일어나는
          곳이 도우인이다. 따로 세워 두면 읽는 사람이 두 묶음을 오가며
          경로와 플랫폼을 눈으로 짝지어야 했다. 한 카드 안에 위아래로
          붙이면 그 짝이 처음부터 지어져 있다.

          카드 두 장은 index 로 짝짓는다 — journey.paths[i] 와
          platformRoles.items[i] 가 같은 갈래다(0: 신뢰/샤오홍슈,
          1: 전환/도우인). 한쪽 순서를 바꾸면 다른 쪽도 같이 바꿔야 한다.

          플랫폼 판은 둘 다 같은 회색으로 둔다. 예전에는 도우인만 남색을
          깔아 "여기서 판매가 일어난다"를 색으로 말했는데, 이 지면에서
          남색은 이미 "다이버즈 쪽"을 가리키는 색이다(SOLUTION_BG —
          NEEDS 카드·비교표·STAGE 02·병원 탭 유입 시스템). 여기서만 다른
          뜻으로 쓰면 그 약속이 흐려진다. 두 갈래는 우열이 아니라 나란한
          경로이기도 하다. */}
      <div className="section-gap">
        <BlockHead
          label="JOURNEY"
          title={marketing.journey.title}
          body={marketing.journey.body}
        />

        {/* 카드 두 장이 "경로 / 플랫폼" 두 층으로 나뉘는데, 층의 경계가
            두 장에서 같은 높이에 있어야 나란히 읽힌다. 카드마다 알아서
            바닥에 붙이면(mt-auto) 안 맞는다 — 샤오홍슈 판은 역할이 네 줄,
            도우인 판은 세 줄이라 판 자체의 키가 다르고, 카드 키는 같으니
            더 긴 판이 그만큼 위에서 시작한다. subgrid 로 두 장이 바깥
            그리드의 같은 두 줄을 나눠 쓰게 하면 경계가 저절로 맞는다.
            한 단으로 쌓이는 구간(lg 미만)에서는 나란히 설 상대가 없어
            걸지 않는다. */}
        <ul className="mt-12 grid gap-5 lg:grid-cols-2 lg:grid-rows-[auto_auto]">
          {marketing.journey.paths.map((path, i) => {
            const platform = marketing.platformRoles.items[i];
            return (
              <Reveal
                as="li"
                key={path.name}
                delay={60 + i * 60}
                className="grid overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_28px_60px_-24px_rgb(10_21_38/0.35)] lg:row-span-2 lg:grid-rows-subgrid"
              >
                {/* 위 — 그 경로가 일어나는 플랫폼.

                    플랫폼을 먼저 세운다. 읽는 순서가 "샤오홍슈 → 후기/검색
                    기반 구매"가 되어야 어디서 일어나는 이야기인지 잡은 채로
                    네 단계를 읽는다(예전에는 경로를 다 읽고 나서야 플랫폼
                    이름이 나왔다).

                    한 층짜리 남색 띠로 눌러 둔다. 예전에는 이 칸이 "주요
                    역할 / 다이버즈가 하는 일" 두 단짜리 판이라 위 경로
                    칸만큼 키가 컸고, 카드 한 장이 사실상 두 장처럼 읽혔다.
                    플랫폼이 소비자에게 하는 일(브랜드 발견·후기 확인 …)은
                    바로 위 경로 네 단계가 이미 말하고 있어 겹치는 말이기도
                    했다. 그래서 그 목록은 걷고, 남은 것(플랫폼 이름·역할·
                    한 줄 설명 + 우리 몫)만 가로로 펴 배너 한 줄로 만든다.

                    이 안쪽은 .on-light 반전이 닿지 않는 자리라 역할 토큰
                    대신 절대 팔레트(white·#acd4ff)를 쓴다 — NEEDS 카드의
                    해결 칸과 같은 규칙이다. */}
                {platform && (
                  <div className={cn("p-7 text-white sm:p-8", SOLUTION_BG)}>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
                      <p className="font-display text-xs font-bold tracking-[0.3em] text-[#acd4ff]">
                        {platform.en}
                      </p>
                      <p className="text-fluid-lg font-bold tracking-tight break-keep text-white">
                        {platform.name}
                      </p>
                      <p className="text-fluid-base font-semibold break-keep text-[#acd4ff]">
                        {platform.role}
                      </p>
                    </div>

                    {/* 우리 몫은 알약으로 가로로 편다. 세로 목록이면 다시
                        판이 되고, 가로로 흐르면 띠의 아랫줄로 앉는다.
                        알약은 흰 면 — 남색 위에서 가장 밝은 자리라 이 띠에서
                        눈이 먼저 닿는다. 체크는 #acd4ff 가 아니라 mid 로
                        둔다: 그 하늘색은 남색 위에 쓰라고 고른 색이라 흰
                        바탕에서는 대비가 2점대로 떨어진다. */}
                    <div className="mt-5 border-t border-white/10 pt-5">
                      <ul className="flex flex-wrap gap-2">
                        {platform.work.map((work) => (
                          <li
                            key={work}
                            className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-svc-body leading-none font-medium break-keep text-abyss"
                          >
                            <Check
                              aria-hidden
                              strokeWidth={2.5}
                              className="size-3.5 shrink-0 text-mid"
                            />
                            {work}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                {/* 아래 — 그 플랫폼에서 소비자가 밟는 경로. */}
                {/* 카드를 세는 큰 배경 숫자(01·02)는 두지 않는다 — 아래
                    경로 목록이 이미 01~04 배지를 달고 있어서, 한 카드 안에
                    큰 숫자와 작은 숫자가 겹쳐 어느 쪽이 순서인지 흐려졌다.
                    두 장뿐이라 세어 줄 필요도 크지 않다. */}
                <div className="p-7 sm:p-8">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* 갈래 이름표는 STAGE 머리의 담당 알약과 같은 문법
                        (테두리 액센트 + 액센트 글자)으로 맞춘다. */}
                    <span className="rounded-full border border-accent/40 px-3 py-1 text-sm font-bold tracking-tight text-accent">
                      {path.kind}
                    </span>
                    <p className="text-fluid-lg font-bold tracking-tight break-keep text-foreground">
                      {path.name}
                    </p>
                  </div>

                  {/* 단계는 번호를 달아 세로로 내린다 — 가로로 늘어놓으면
                      화살표가 필요해지고, 좁은 화면에서 그 화살표가 먼저
                      깨진다.

                      배지와 이음선은 STAGE 머리의 공정과 같은 문법이다
                      (흰 원 + 액센트 숫자 + abyss/10 실선). 마지막 칸만
                      남색으로 채워 "여기가 구매"라고 색으로 말한다 —
                      NEEDS 카드에서 해결 칸을 남색으로 세운 것과 같다. */}
                  <ol className="mt-7">
                    {path.steps.map((step, n) => {
                      const last = n === path.steps.length - 1;
                      return (
                        <li
                          key={step}
                          className="relative flex gap-4 pb-5 last:pb-0"
                        >
                          {!last && (
                            <span
                              aria-hidden
                              className="absolute top-9 bottom-0 left-[17px] w-px bg-abyss/10"
                            />
                          )}
                          <span
                            className={cn(
                              "relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full font-display text-[0.7rem] font-bold tabular-nums",
                              last
                                ? "bg-abyss text-[#acd4ff]"
                                : "bg-white text-accent ring-1 ring-abyss/10",
                            )}
                          >
                            {String(n + 1).padStart(2, "0")}
                          </span>
                          <span
                            className={cn(
                              "pt-1.5 text-fluid-base leading-[1.5] break-keep",
                              last
                                ? "font-bold text-foreground"
                                : "text-foreground/80",
                            )}
                          >
                            {step}
                          </span>
                        </li>
                      );
                    })}
                  </ol>

                  <p className="mt-7 border-t border-abyss/[0.08] pt-5 text-svc-body leading-[1.8] break-keep text-foreground/50">
                    {path.note}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>

      {/* SERVICES — 마케팅 서비스 넷(제안서 p20~p25). 금액은 넣지 않는다. */}
      <div className="section-gap">
        <BlockHead
          label="SERVICES"
          title={marketing.services.title}
          body={marketing.services.body}
        />

        {/* 카드 넷은 같은 격이라 색으로 서열을 만들지 않는다(추천 하나를
            남색으로 세우는 PACKAGE 와 다른 점이다). 대신 세 가지로 결을
            준다 — 오른쪽 위에 옅게 깔리는 큰 번호, 한 급 큰 제목, 그리고
            제공 항목을 알약으로 깐 목록. 예전에는 번호/제목/본문/체크목록이
            전부 같은 크기의 글자라 네 장이 문단 넷처럼 보였다. */}
        <ul className="mt-12 grid gap-6 lg:grid-cols-2">
          {marketing.services.items.map((service, i) => (
            <Reveal as="li" key={service.no} delay={60 + i * 50}>
              <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_28px_60px_-24px_rgb(10_21_38/0.35)] sm:p-8">
                {/* 번호는 읽는 값이 아니라 카드를 세는 표식이다. 자리도
                    크기도 NEEDS 카드와 같게 맞춘다 — 오른쪽 구석에 크게
                    깔지 않고, 제목 위 왼쪽에 작게(2rem) 세워 글의 시작점을
                    잡아 준다. 한 지면에서 같은 뜻의 요소는 같은 모양이어야
                    한다. */}
                <span
                  aria-hidden
                  className="relative font-display text-[2rem] leading-none font-bold text-abyss/[0.18] tabular-nums"
                >
                  {service.no}
                </span>

                <p className="relative mt-4 text-fluid-lg font-bold tracking-tight break-keep text-foreground">
                  {service.name}
                </p>

                <p className="relative mt-4 text-svc-body leading-[1.8] break-keep text-foreground/60">
                  <Sentences text={service.body} />
                </p>

                {/* 제공 항목은 알약으로 깐다. 체크 아이콘만 늘어놓으면
                    본문과 같은 무게로 읽혀 어디까지가 설명이고 어디부터가
                    목록인지 흐려진다.

                    알약 바탕은 남색 그라디언트(SOLUTION_BG) — 이 지면에서
                    남색은 "다이버즈가 하는 일"을 가리키는 색이고, 이 목록이
                    바로 그 목록이다(플랫폼 판의 우리 몫 알약과 같은 뜻).
                    흰 카드 위에서 네 줄이 한 덩어리로 뭉쳐 보이는 효과도
                    있어 설명과 목록이 확실히 갈린다. */}
                <ul className="relative mt-7 grid gap-2">
                  {service.points.map((point) => (
                    <li
                      key={point}
                      className={cn(
                        "flex items-start gap-2.5 rounded-xl px-4 py-3 text-fluid-base leading-[1.5] font-medium break-keep text-white/90",
                        SOLUTION_BG,
                      )}
                    >
                      <Check
                        aria-hidden
                        strokeWidth={2.5}
                        className="mt-0.5 size-4 shrink-0 text-[#acd4ff]"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </ul>

        <BlockNote>{marketing.services.note}</BlockNote>
      </div>

      {/* PACKAGES — 운영 패키지 넷(제안서 p26). 입점 플랜 카드와 같은 문법을
          쓴다 — 한 지면에서 고르는 자리가 둘이라, 모양이 다르면 서로 다른
          성격의 상품으로 읽힌다. */}
      <div className="section-gap">
        <BlockHead
          label="PACKAGE"
          title={marketing.packages.title}
          body={marketing.packages.body}
        />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {marketing.packages.items.map((pack, i) => (
            <Reveal as="li" key={pack.name} delay={60 + i * 50}>
              <div
                className={cn(
                  "flex h-full flex-col gap-5 rounded-2xl border p-7 transition-all duration-300",
                  pack.recommended
                    ? cn(
                        "border-transparent text-white hover:-translate-y-1 hover:shadow-[0_28px_60px_-24px_rgb(10_21_38/0.55)]",
                        SOLUTION_BG,
                      )
                    : "border-gray-200 bg-white text-foreground hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_24px_50px_-28px_rgb(10_21_38/0.3)]",
                )}
              >
                <div>
                  {pack.recommended && (
                    <p className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#acd4ff] px-3.5 py-1.5 text-sm font-bold tracking-[-0.01em] text-abyss">
                      <Star
                        aria-hidden
                        strokeWidth={2.5}
                        className="size-4 fill-current"
                      />
                      추천
                    </p>
                  )}
                  <p className="font-display text-fluid-base font-bold tracking-[0.1em] break-keep">
                    {pack.name}
                  </p>
                  <p
                    className={cn(
                      "mt-2 text-fluid-base leading-[1.5] break-keep",
                      pack.recommended ? "text-[#acd4ff]" : "text-accent",
                    )}
                  >
                    {pack.aim}
                  </p>
                </div>

                <ul className="flex-1 space-y-3">
                  {pack.includes.map((item) => (
                    <li
                      key={item}
                      className={cn(
                        "flex items-start gap-2 text-fluid-base leading-[1.5] break-keep",
                        pack.recommended
                          ? "text-white/85"
                          : "text-foreground/80",
                      )}
                    >
                      <BadgeCheck
                        aria-hidden
                        strokeWidth={2}
                        className={cn(
                          "mt-0.5 size-5 shrink-0",
                          pack.recommended ? "text-[#acd4ff]" : "text-accent",
                        )}
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <p
                  className={cn(
                    "border-t pt-5 text-fluid-sm leading-[1.6] break-keep",
                    pack.recommended
                      ? "border-white/15 text-white/60"
                      : "border-gray-100 text-foreground/50",
                  )}
                >
                  {pack.target}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>

        <BlockNote>{marketing.packages.note}</BlockNote>
      </div>
    </section>
  );
}
