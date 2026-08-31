import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  ChevronsUp,
  Clock,
  Compass,
  Cookie,
  Flame,
  Gift,
  Rocket,
  Shirt,
  TrendingUp,
  Trophy,
  UserPlus,
  Wrench,
} from "lucide-react";
import Bubbles from "@/components/bubbles";
import RecruitApplyForm from "@/components/recruit-apply-form";
import RecruitHero from "@/components/recruit-hero";
import Reveal from "@/components/reveal";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { company, recruit } from "@/lib/site";
import { SOLUTION_BG } from "@/lib/theme";

/**
 * 인재상 카드에 붙는 아이콘. lib/site.ts 는 React 를 들이지 않으므로
 * 데이터의 id 로 여기서 짝지어 준다.
 */
const TRAIT_ICONS = {
  grit: Flame,
  proactive: Rocket,
  growth: TrendingUp,
  achieve: Trophy,
  breakthrough: Compass,
} as const;

/** 근무 환경 카드에 붙는 아이콘. 위 TRAIT_ICONS 와 같은 규칙이다. */
const BENEFIT_ICONS = {
  education: BookOpen,
  tools: Wrench,
  referral: UserPlus,
  dresscode: Shirt,
  snack: Cookie,
  leave: CalendarCheck,
  promotion: ChevronsUp,
  holiday: Gift,
  flextime: Clock,
} as const;

/**
 * 벤토 격자에서 다섯 칸이 차지하는 자리. magicui 데모의 3×3 배치를 그대로
 * 쓴다 — 가운데 열이 세 행을 통으로 쓰고, 좌우 열이 2:1 과 1:2 로 갈린다.
 * lg 미만에서는 BentoCard 기본값(col-span-3)이라 한 줄에 한 칸씩 쌓인다.
 */
const TRAIT_SPANS = [
  "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-4",
  "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2",
  "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  "lg:col-start-3 lg:col-end-4 lg:row-start-2 lg:row-end-4",
] as const;

/**
 * 인재상 카드의 글자를 흰색으로 뒤집는다.
 *
 * BentoCard 는 제목/설명/아이콘 색을 자기 안에 text-neutral-700 / -400 으로
 * 박아 두고 있는데, 그 파일은 라이브러리에서 그대로 옮겨 온 것이라 손대지
 * 않는다. 대신 자손 선택자로 이 지면에서만 덮는다 — `.card h3` (0,1,1)가
 * `.text-neutral-700` (0,1,0)을 특정도로 이긴다.
 * 맨 앞의 text-white 는 CTA 링크 몫이다(제 색이 없어 물려받는다).
 */
const TRAIT_CARD_DARK =
  "text-white [&_h3]:text-white [&_p]:text-white/75 [&_svg]:text-white";

export const metadata: Metadata = {
  title: "RECRUITING",
  description:
    "다이버즈 하반기 채용. 퍼포먼스 마케팅 팀장, 콘텐츠팀 PD, 광고 영업기획 팀장을 모집합니다.",
};

/**
 * 지원 메일 링크. 직군을 넘기면 제목까지 채워진 메일이 열려서, 받는 쪽에서
 * 어떤 자리에 온 지원인지 제목만 보고 갈린다.
 */
function mailtoHref(position?: string) {
  const subject = position
    ? `[${recruit.subjectPrefix}] ${position}`
    : `[${recruit.subjectPrefix}]`;
  return `mailto:${recruit.email}?subject=${encodeURIComponent(subject)}`;
}

/** "\n"으로 나뉜 문구를 줄 단위로 끊는다. 배너 문구가 전부 이 꼴이다. */
function Lines({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <span key={i} className="block">
          {line}
        </span>
      ))}
    </>
  );
}

/**
 * 섹션 대제목. 이 지면의 구간은 라벨이 아니라 "큰 국문 제목 + 그 아래
 * 회색 부연" 한 벌로만 열린다.
 */
function Heading({
  title,
  lead,
  centered = false,
  accent = false,
}: {
  title: string;
  lead?: string;
  /** 제목/부연을 가운데로 세운다. 폭을 좁혀 가운데 놓은 구간에서만 켠다. */
  centered?: boolean;
  /**
   * 제목을 포인트 컬러로 세운다.
   *
   * 어두운 판(근무 환경)의 제목에만 켠다 — 거기서는 아래 카드 아홉 장의
   * 제목도 전부 foreground 라, 묶음 제목까지 같은 색이면 아홉 장 위에
   * 얹힌 열 번째 줄처럼 읽힌다. 색이 하나 갈리면 그 줄이 이 구간의
   * 머리라는 게 바로 잡힌다.
   */
  accent?: boolean;
}) {
  return (
    <>
      <Reveal>
        <h2
          className={`break-keep font-display text-[clamp(1.6rem,3.6vw,2.75rem)] leading-[1.3] font-bold tracking-tight ${
            accent ? "text-accent" : "text-foreground"
          } ${centered ? "text-center" : ""}`}
        >
          <Lines text={title} />
        </h2>
      </Reveal>
      {lead && (
        <Reveal delay={90}>
          <p
            className={`mt-6 max-w-2xl break-keep text-fluid-lg leading-relaxed text-muted sm:whitespace-pre-line ${
              centered ? "mx-auto text-center" : ""
            }`}
          >
            {lead}
          </p>
        </Reveal>
      )}
    </>
  );
}

/**
 * 모집 직군 한 자리 — 연회색 라운드 판.
 *
 * 접지 않고 통째로 펼쳐 둔다. 자리가 셋뿐이고, 공고는 원래 다 읽으라고
 * 쓴 글이다.
 */
function Position({
  position,
}: {
  position: (typeof recruit.positions)[number];
}) {
  /* 공고마다 라벨 묶음이 다르다(콘텐츠 PD만 넷). 리터럴 배열이 서로 달라
     union 위에서 map 이 호출되지 않으므로 타입을 눕혀 둔다. */
  const sections = position.sections as readonly {
    label: string;
    items: readonly string[];
  }[];
  const treatment =
    "treatment" in position
      ? (position.treatment as {
          title: string;
          body: string;
          items: readonly { no: string; label: string; value: string }[];
        })
      : null;

  return (
    <Reveal as="article">
      {/* 흰 지면 위의 흰 판이라 테두리가 경계를 만든다. border-line 은
          .on-light 안에서 abyss/10 으로 뒤집히는 가는 선이다.
          그림자는 링 없이 두 겹만 준다 — 채용 절차 카드는 테두리가 없어
          그림자 스택에 1px 링을 섞었는데, 여기는 진짜 테두리가 있어서
          같이 쓰면 선이 두 겹으로 두꺼워진다.
          판이 커서 퍼짐도 그만큼 넓게(36px) 잡는다. */}
      <div
        id={position.id}
        className="scroll-mt-28 rounded-[20px] border border-line bg-white p-8 shadow-[0_2px_4px_rgb(10_21_38/0.04),0_18px_36px_-12px_rgb(10_21_38/0.10)] sm:p-11 lg:p-14"
      >
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <h3 className="font-display text-fluid-3xl font-bold tracking-tight text-foreground">
            {position.name}
          </h3>
          <span className="text-fluid-base text-muted">{position.role}</span>
        </div>

        {/* 대우 조건 — 영업기획 공고에만 붙는다. 밝은 판 위에 어두운 판을
            얹어, 이 지면에서 눈이 한 번 멈추는 유일한 자리로 둔다. */}
        {treatment && (
          <div
            className={`mt-10 rounded-[20px] ${SOLUTION_BG} px-8 py-10 sm:px-11 sm:py-12`}
          >
            <p className="break-keep font-display text-fluid-xl font-bold tracking-tight text-white">
              {treatment.title}
            </p>
            {/* 흐린 글자들은 단색 abyss 때보다 한 단씩 올린다. 그라디언트의
                밝은 쪽(#2d3d6a)이 글이 놓이는 좌상단이라, 예전 값(55/45)
                그대로 두면 그 자리에서 대비가 무너진다. */}
            <p className="mt-2 break-keep text-fluid-base leading-relaxed text-white/70">
              {treatment.body}
            </p>

            <dl className="mt-10 grid gap-8 sm:grid-cols-3">
              {treatment.items.map((item) => (
                <div key={item.no} className="border-t border-white/20 pt-5">
                  <span className="font-display text-xs font-bold tracking-[0.2em] text-accent-soft tabular-nums">
                    {item.no}
                  </span>
                  <dt className="mt-4 text-fluid-sm text-white/60">
                    {item.label}
                  </dt>
                  <dd className="mt-1 break-keep font-display text-fluid-2xl font-bold tracking-tight text-white">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* 3열까지 벌리지 않는다 — 두 칸 배치로 판이 좁아져서, 3열이면
            한 줄에 한두 낱말만 얹힌 채 목록이 세로로 길어진다. */}
        <div className="mt-11 grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {sections.map((section) => (
            <div key={section.label}>
              <p className="font-display text-fluid-base font-bold text-foreground">
                {section.label}
              </p>
              {/* 불릿 기호를 쓰지 않는다 — 줄바꿈과 간격만으로 목록이 읽힌다. */}
              <ul className="mt-4 space-y-2">
                {section.items.map((item) => (
                  <li
                    key={item}
                    className="break-keep text-fluid-base leading-relaxed text-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <a
          href={mailtoHref(position.name)}
          /* 바탕은 SOLUTION_BG — 글로벌 마케팅 지면이 "다이버즈 쪽"을
             나타낼 때 쓰는 남색 그라디언트다(lib/theme.ts). 값을 여기 다시
             적지 않는다 — 같은 남색을 쓰는 자리가 이미 여럿이라 각자 적어
             두면 한쪽만 고쳐질 자리가 된다. */
          className={`group mt-11 inline-flex items-center gap-2 rounded-full ${SOLUTION_BG} px-7 py-3.5 font-display text-sm font-bold tracking-tight text-white transition hover:brightness-110`}
        >
          {position.name} 지원하기
          <ArrowRight
            aria-hidden
            className="h-4 w-4 transition group-hover:translate-x-1"
          />
        </a>
      </div>
    </Reveal>
  );
}

export default function RecruitingPage() {
  return (
    <>
      <RecruitHero
        label={recruit.hero.label}
        question={recruit.hero.question}
        body={recruit.hero.body}
        outro={recruit.hero.outro}
      />

      {/* 히어로 아래는 전부 밝은 지면이다. .on-light 가 색 "역할" 토큰을 흰
          배경용으로 뒤집어 주므로(app/globals.css) text-foreground /
          text-muted / bg-surface 를 그대로 쓰면 된다. */}
      <div className="on-light bg-white">
        {/* ── 인재상 ─────────────────────────────────────────── */}
        <section className="page-container py-24 sm:py-32">
          {/* 읽는 폭을 캡으로 묶고 가운데 세운다. page-container 전체 폭
              (최대 1800px)에 3열 벤토를 깔면 칸 하나가 550px을 넘어가 사진이
              지면을 다 먹는데, 캡만 걸고 왼쪽에 붙여 두면 이번엔 오른쪽이
              통째로 비어 지면이 한쪽으로 쏠린다. 제목도 같은 상자 안에서
              가운데로 세워 격자와 축을 맞춘다. */}
          <div className="mx-auto max-w-[76rem]">
            <Heading
              centered
              title={recruit.whoWeWant.title}
              lead={"함께 일할 사람을 고를 때 경력보다 먼저 봅니다.\n일을 대하는 태도가 결국 성과의 크기를 정하기 때문입니다."}
            />

            {/* 벤토 격자 — 다섯 칸이 서로 다른 높이로 맞물린다.
                두 클래스가 서로 다른 구간을 맡는다.
                 - lg 이상: grid-rows-3 이 행 셋을 못 박는다. 이때 행은 1fr 로
                   내용에 맞춰 잡히고, auto-rows 는 "암묵 행"에만 걸리는 값이라
                   적용되지 않는다.
                 - lg 미만: 명시 행이 없어 칸이 암묵 행으로 하나씩 쌓이고,
                   그 높이를 auto-rows 가 정한다. 컴포넌트 기본값(22rem=352px)
                   은 한 화면을 거의 다 먹어서 15rem 으로 눌렀다
                   (cn 의 twMerge 가 같은 그룹을 뒤엣것으로 덮는다). */}
            <BentoGrid className="mt-14 auto-rows-[15rem] sm:mt-16 lg:grid-rows-3">
              {recruit.whoWeWant.items.map((trait, i) => (
                <BentoCard
                  key={trait.id}
                  name={trait.text}
                  description={trait.body}
                  Icon={TRAIT_ICONS[trait.id]}
                  href="#positions"
                  cta="채용 직군 보기"
                  className={`${TRAIT_SPANS[i]} ${TRAIT_CARD_DARK}`}
                  background={<TraitBackground trait={trait} priority={i === 0} />}
                />
              ))}
            </BentoGrid>
          </div>
        </section>
      </div>

      {/* ── 근무 환경 ────────────────────────────────────────
          이 구간만 어두운 판이라 .on-light 밖에 둔다. 밖에서는 색 "역할"
          토큰이 사이트 기본값(어두운 배경용)으로 돌아오므로, 안쪽의
          text-foreground / text-muted / border-line / text-accent 를 하나도
          바꾸지 않아도 그대로 읽힌다 — 자리마다 색을 덧칠하는 것보다 낫다. */}
      {/* 좌우 여백은 아래 모집 직군 · 채용 절차와 같은 .service-page 규칙을
          쓴다 — 제목의 왼쪽 기준선이 그 구간들과 한 줄로 서야, 지면을
          내려오는 동안 글이 좌우로 흔들리지 않는다.
          예전에는 기본 여백(96px)에 max-w-[68rem] 캡을 더해 가운데로
          몰아 뒀는데, 그러면 이 구간만 제목이 80px 안쪽에서 시작했다.
          카드가 헐렁해 보일까 봐 좁힌 것이었지만, 기준선이 어긋나는 값이
          더 크다 — 캡을 걷고 여백으로 폭을 잡는다. */}
      <section className="service-page bg-abyss py-24 sm:py-32">
        <div className="page-container">
          <div>
            <Heading title={recruit.benefits.title} accent />

            {/* 어두운 판 위에서는 카드도 어둡게 간다. 흰 카드를 그대로 두면
                아홉 장이 통째로 튀어 이 구간만 다른 지면처럼 보인다.
                경계는 그림자가 아니라 가는 테두리가 맡는다 — 어두운 바탕
                에서는 그림자가 보이지 않는다. */}
            <ul className="mt-14 grid gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
              {recruit.benefits.items.map((benefit, i) => {
                const Icon = BENEFIT_ICONS[benefit.id];
                return (
                  <Reveal as="li" key={benefit.id} delay={(i % 3) * 70}>
                    {/* 아이콘을 글 왼쪽에 세운다. 위에 얹으면 카드가 세로로
                        길어지는데, 안에 든 글이 두 줄뿐이라 그만큼 아래가
                        빈다. 옆에 두면 카드가 납작해지고 비는 폭도 준다. */}
                    <div className="flex h-full items-start gap-5 rounded-[20px] border border-line bg-deep/30 p-7 transition-colors duration-300 hover:border-accent/40">
                      {/* 크기를 키운 만큼 선을 얇게 준다 — 기본 굵기(2)로
                          36px까지 키우면 획이 뭉쳐 아이콘이 검은 덩어리가 된다. */}
                      <Icon
                        aria-hidden
                        strokeWidth={1.5}
                        className="mt-0.5 h-9 w-9 shrink-0 text-accent"
                      />
                      <div className="min-w-0">
                        <p className="break-keep font-display text-fluid-lg font-bold text-foreground">
                          {benefit.title}
                        </p>
                        <p className="mt-1.5 break-keep text-fluid-base leading-relaxed text-muted">
                          {benefit.body}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <div className="on-light bg-white">

        {/* ── 모집 직군 · 채용 절차 ───────────────────────────
            두 구간은 서비스 상세 지면(app/service/[slug])과 같은 좌우 여백을
            쓴다. .service-page 는 그 안의 .page-container 여백을 넓은
            화면에서 128px → 190px 로 벌리는 클래스다(app/globals.css) —
            값을 여기 다시 적지 않고 그 클래스를 그대로 건다. */}
        <div className="service-page">
        {/* ── 모집 직군 ────────────────────────────────────────
            id — 위 인재상 카드의 "채용 직군 보기"가 이리로 건너뛴다. */}
        <section id="positions" className="page-container scroll-mt-24 py-24 sm:py-32">
          {/* 제목이 왼쪽, 직군 판이 오른쪽인 두 칸.
              폭은 바깥 .service-page 래퍼가 정한다 — 아래 채용 절차와 함께
              서비스 상세 지면과 같은 좌우 여백을 쓴다. */}
          <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
            {/* 판 셋을 지나는 동안 제목이 화면에 남아 있게 붙여 둔다. */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              {/* 자리 수("세 자리")를 문구에서 뺐다 — 공고를 하나 더하거나
                  빼면 지면이 곧바로 거짓말을 하는 자리였다. 대신 어떤 사람을
                  찾는지로 말한다.

                  세 줄로 끊는다. 제목 칸이 22rem(352px)이라 한 줄에 여덟
                  글자쯤 들어가서, 두 줄로 두면 자연 개행이 한 번 더 일어나
                  엉뚱한 자리에서 갈린다. 끊는 자리를 칸 폭에 맞춰 잡아 둔다. */}
              <Heading
                title={"함께 깊이 파고들\n동료를\n찾고 있습니다."}
                lead="직군마다 하는 일과 필요한 경험이 다릅니다."
              />
            </div>

            <div className="space-y-5">
              {recruit.positions.map((position) => (
                <Position key={position.id} position={position} />
              ))}
            </div>
          </div>
        </section>

        {/* ── 채용 절차 ──────────────────────────────────────── */}
        {/* 이 구간은 회색 띠(bg-surface)를 걷고 흰 지면 그대로 간다.
            대신 칸이 배경에서 떨어져 나와야 해서 카드에 그림자를 준다. */}
        <section className="page-container py-24 sm:py-32">
          {/* 바로 위 모집 직군과 같은 폭(바깥 .service-page 래퍼가 정한다).
              여기만 다르게 두면 두 구간의 왼쪽 끝이 어긋나 지면이 깨져 보인다. */}
          <div>
            <Heading title="채용 절차" />

            <ol className="mt-14 grid gap-5 sm:mt-16 sm:grid-cols-3">
              {recruit.process.map((step, i) => {
                // 마지막 칸(최종 합격)만 채운다 — 배너에서도 이 칸만 색이 있다.
                const last = i === recruit.process.length - 1;
                return (
                  <Reveal as="li" key={step.no} delay={i * 90}>
                    <div
                      className={`h-full rounded-[20px] px-8 py-10 ${
                        last
                          ? SOLUTION_BG
                          : /* 흰 지면 위의 흰 카드라 그림자가 유일한 경계다.
                               1px 링을 한 겹 깔아 흐린 화면에서도 칸이 서게 한다. */
                            "bg-white shadow-[0_0_0_1px_rgb(10_21_38/0.04),0_2px_4px_rgb(10_21_38/0.05),0_14px_28px_rgb(10_21_38/0.07)]"
                      }`}
                    >
                      <span
                        className={`font-display text-xs font-bold tracking-[0.18em] tabular-nums ${
                          last ? "text-accent-soft" : "text-accent"
                        }`}
                      >
                        {step.no}
                      </span>
                      <p
                        className={`mt-4 font-display text-fluid-xl font-bold tracking-tight ${
                          last ? "text-white" : "text-foreground"
                        }`}
                      >
                        {step.title}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </ol>
  </div>
        </section>

        </div>
      </div>

      {/* ── 지원 안내 ────────────────────────────────────────
          CONTACT 지면(app/contact/page.tsx)과 같은 문법으로 짠다 — 어두운 판,
          왼쪽에 큰 문장과 연락처, 오른쪽에 밑줄 스타일 폼. 한 사이트에 폼이
          둘인데 서로 다른 모양이면 그 자체로 만든 사람이 둘로 보인다.
          .on-light 밖이라 색 토큰은 어두운 배경용으로 돌아온다. */}
      <section className="relative overflow-hidden bg-abyss py-24 sm:py-32">
        <Bubbles />
        <div className="page-container relative grid gap-16 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            {/* 문장과 연락처를 위아래 끝으로 밀어 오른쪽 폼의 높이를 받는다. */}
            <div className="flex h-full flex-col justify-between gap-16">
              <h2 className="text-balance break-keep font-display text-fluid-2xl leading-[1.15] font-bold tracking-tight text-white">
                좋은 사람 한 명이
                <br />
                회사의 <span className="text-white/40">방향</span>을
                <br />
                바꾼다고 믿습니다.
              </h2>

              <dl className="space-y-2 text-sm">
                <div className="flex gap-3">
                  <dt className="font-bold text-white">E.</dt>
                  <dd>
                    <a
                      href={mailtoHref()}
                      className="text-white/70 transition-colors hover:text-accent-soft"
                    >
                      {recruit.email}
                    </a>
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt className="font-bold text-white">A.</dt>
                  <dd className="text-white/70">{company.address}</dd>
                </div>
              </dl>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <RecruitApplyForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}

/**
 * 인재상 카드의 배경 — 팀 사진 한 장.
 *
 * BentoCard 는 글(아이콘/제목/설명)을 칸 아래쪽에 놓으므로, 사진 위에
 * 두 겹을 덮어 그 자리를 어둡게 깐다(글자는 흰색 — TRAIT_CARD_DARK).
 *  1) 어두운 틴트 — 사진마다 다른 색온도를 한 톤으로 누른다.
 *  2) 아래에서 위로 빠지는 어두운 그라디언트 — 글이 놓이는 아랫부분만
 *     진하게 덮는다.
 */
function TraitBackground({
  trait,
  priority = false,
}: {
  trait: (typeof recruit.whoWeWant.items)[number];
  priority?: boolean;
}) {
  return (
    <>
      <Image
        src={trait.image}
        alt=""
        aria-hidden
        fill
        priority={priority}
        sizes="(min-width: 1024px) 26rem, 100vw"
        className="object-cover"
      />
      {/* 사진마다 다른 색온도를 한 톤으로 눌러 다섯 장이 한 벌로 보이게 한다. */}
      <div aria-hidden className="absolute inset-0 bg-abyss/35" />
      {/* 아래에서 위로 빠지는 어두운 그라디언트. 글이 놓이는 아랫부분만
          진하게 덮고, 위쪽은 열어 사진이 그대로 보이게 둔다. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-abyss/95 via-abyss/65 to-abyss/10"
      />
    </>
  );
}
