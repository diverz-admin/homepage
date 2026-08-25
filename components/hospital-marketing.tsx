import Image from "next/image";
import {
  CalendarCheck,
  ChartColumn,
  Check,
  Headset,
  Images,
  Languages,
  PenLine,
  RefreshCw,
  Settings,
  ThumbsUp,
  type LucideIcon,
} from "lucide-react";

import Reveal from "@/components/reveal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { hospitalMarketing } from "@/lib/site";

/**
 * 글로벌 마케팅 대제목 아래로 매달리는 첫 상품.
 *
 *   01 중국인 유입 병원 마케팅
 *
 * 흐름은 제안서를 그대로 따른다.
 *
 *   후킹 + 계정 화면 → 운영 구조 아홉 → 유입 시스템 아홉 단계(어두운 띠)
 *   → 공식 계정과 외부 콘텐츠 → 패키지 → 닫는 한 줄
 *
 * 앞의 "운영 구조"와 뒤의 "유입 시스템"은 항목이 겹쳐 보이지만 말하는 층이
 * 다르다 — 앞은 매달 무엇을 하는가(나란한 업무), 뒤는 그 일들이 어떤 순서로
 * 이어져 예약까지 가는가(한 줄기 흐름)다. 그래서 앞은 탭으로 골라보는 박스,
 * 뒤는 어두운 띠 위의 타임라인으로 판형을 갈라 놓았다.
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

/** 운영 구조 카드의 아이콘. 데이터는 이름만 들고 있다(lib/site.ts). */
const operationIcons: Record<string, LucideIcon> = {
  CalendarCheck,
  Images,
  Languages,
  PenLine,
  Settings,
  ThumbsUp,
  Headset,
  ChartColumn,
  RefreshCw,
};

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

export default function HospitalMarketing() {
  const {
    name,
    title,
    summary,
    operation,
    system,
    packages,
    closing,
  } = hospitalMarketing;

  return (
    <section>
      {/* 후킹 + 샤오홍슈 계정 화면.
          화면 예시를 오른쪽에 세운다 — "먼저 샤오홍슈에서 확인합니다"를
          말로만 두면 남의 나라 앱 이야기로 흘러가고, 실물이 옆에 있어야
          무엇을 보고 결정한다는 말인지 잡힌다.
          lg 미만에서는 글이 먼저, 화면이 그 아래로 내려간다. */}
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
        <div>
          {/* 상품 이름. 번호와 후킹 문장 사이에 얹는 이름표다 — 후킹만 있으면
              "무슨 상품 이야기인지"가 문장을 다 읽은 뒤에야 잡힌다.
              크기는 후킹보다 한참 작게, 색은 포인트 컬러로 둔다. */}
          <Reveal delay={40}>
            <p className="text-fluid-lg font-bold tracking-[-0.02em] break-keep text-accent">
              {name}
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
            <p className="mt-6 max-w-2xl text-fluid-lg leading-[1.85] font-normal tracking-[-0.04em] break-keep text-foreground/85">
              {summary}
            </p>
          </Reveal>

        </div>

        <Reveal delay={100} className="lg:pt-2">
          {/* 실제 운영 계정 화면. 원본이 351px짜리라 더 키우면 뭉개진다 —
              폭 상한을 걸고 가운데에 세운다. 계정명과 얼굴은 원본에서 이미
              가려져 있다. */}
          <div className="mx-auto w-full max-w-[300px] overflow-hidden rounded-[2rem] border border-line shadow-[0_24px_60px_-30px_rgb(10_21_38/0.45)]">
            <Image
              src="/images/service/global/xiaohongshu-account.png"
              alt="샤오홍슈 병원 공식 계정 화면 예시 — 인증 배지가 붙은 프로필, 팔로워와 좋아요 수, 병원 내부와 방문 콘텐츠가 격자로 쌓인 노트 목록"
              width={351}
              height={705}
              sizes="300px"
              className="h-auto w-full"
            />
          </div>
        </Reveal>
      </div>

      {/* 운영 구조 아홉 — 매달 도는 일. */}
      <div className="mt-24 sm:mt-28">
        <BlockLabel>OPERATION</BlockLabel>

        <Reveal delay={60}>
          <h4 className="mt-5 font-display text-fluid-2xl font-bold tracking-tight break-keep text-foreground">
            {operation.title}
          </h4>
        </Reveal>

        <Reveal delay={80}>
          <p className="mt-5 max-w-3xl text-fluid-base leading-[1.9] tracking-[-0.03em] break-keep text-foreground/80">
            {operation.body}
          </p>
        </Reveal>

        {/* 아홉 항목을 카드로 늘어놓는 대신 탭으로 고르게 한다 — 한 번에 하나씩,
            고른 항목을 큰 박스에서 읽는 편이 아홉 칸을 눈으로 훑는 것보다
            낫다(Feature108 탭+박스 패턴을 이 페이지 톤에 맞춰 옮겼다). */}
        <Reveal delay={100}>
          <Tabs defaultValue={operation.items[0].label} className="mt-12">
            <TabsList className="flex flex-wrap items-center justify-center gap-2">
              {operation.items.map((item) => {
                const Icon = operationIcons[item.icon];
                return (
                  <TabsTrigger
                    key={item.label}
                    value={item.label}
                    className="flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-[0.85rem] font-bold tracking-[-0.01em] text-foreground/60 data-[state=active]:border-accent/30 data-[state=active]:bg-accent/10 data-[state=active]:text-accent"
                  >
                    {Icon && <Icon strokeWidth={2} className="size-4" />}
                    {item.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <div className="mt-6 rounded-2xl border border-line bg-surface/60 p-8 sm:p-12">
              {operation.items.map((item) => {
                const Icon = operationIcons[item.icon];
                return (
                  <TabsContent key={item.label} value={item.label}>
                    <span className="flex size-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
                      {Icon && <Icon strokeWidth={2} className="size-6" />}
                    </span>
                    <p className="mt-6 text-[1.3rem] font-bold break-keep text-foreground">
                      {item.label}
                    </p>
                    <p className="mt-3 max-w-2xl text-[0.95rem] leading-[1.8] break-keep text-foreground/65">
                      {item.body}
                    </p>
                  </TabsContent>
                );
              })}
            </div>
          </Tabs>
        </Reveal>
      </div>

      {/* 유입 시스템 아홉 단계.
          이 묶음에서 유일하게 어두운 지면이다 — 나란한 업무(위 카드)와 한
          줄기 흐름(여기)을 다른 바닥 위에 올려야 둘이 같은 목록으로 안 읽힌다. */}
      <div className="mt-20 rounded-3xl bg-abyss px-6 py-14 sm:mt-24 sm:px-12 sm:py-16">
        <Reveal>
          <h4 className="text-center font-display text-fluid-xl font-bold tracking-tight break-keep text-white">
            {system.title}
          </h4>
        </Reveal>

        <Reveal delay={60}>
          <p className="mx-auto mt-4 max-w-3xl text-center text-[0.95rem] leading-[1.8] tracking-[-0.03em] break-keep text-white/60">
            {system.body}
          </p>
        </Reveal>

        {/* 아홉 걸음. 2xl 부터 한 줄로 눕고, 그 아래에서는 세 칸씩 접힌다.
            잇는 선은 한 줄로 설 때만 긋는다 — 접힌 뒤에도 그으면 줄이 바뀌는
            자리에서 선이 허공으로 이어진다. */}
        <ol className="relative mt-12 grid grid-cols-3 gap-x-4 gap-y-10 sm:gap-x-6 2xl:grid-cols-9">
          <span
            aria-hidden
            className="absolute top-[22px] right-[5%] left-[5%] hidden h-px bg-white/20 2xl:block"
          />
          {system.steps.map((step, i) => (
            <Reveal as="li" key={step} delay={40 + i * 30} className="relative">
              <div className="flex flex-col items-center gap-3 text-center">
                <span
                  className={`flex size-11 items-center justify-center rounded-full font-display text-sm font-bold tabular-nums ${
                    /* 마지막 칸(예약 전환)만 채운다 — 흐름이 닿는 곳이다. */
                    i === system.steps.length - 1
                      ? "bg-[#acd4ff] text-abyss"
                      : "bg-abyss text-white ring-1 ring-white/25"
                  }`}
                >
                  {i + 1}
                </span>
                <p className="text-[0.85rem] leading-[1.5] font-medium break-keep text-white/85">
                  {step}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>

      {/* 패키지. 금액을 지면에 적되, 조건은 금액 곁을 떠나지 않게 붙여 둔다. */}
      <div className="mt-20 sm:mt-24">
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

        <ul className="mt-12 grid gap-5 lg:grid-cols-3">
          {packages.items.map((item, i) => (
            <Reveal as="li" key={item.name} delay={60 + i * 50}>
              {/* 카드 안에서 금액이 맨 아래로 가도록 세로로 편다 — 구성이
                  먼저, 값이 나중이다. h-full + mt-auto 라 구성 항목 수가
                  달라도 셋의 값 줄이 같은 선에 놓인다. */}
              <div className="flex h-full flex-col rounded-2xl border border-line bg-surface/60 p-8">
                <p className="text-fluid-lg font-bold tracking-tight break-keep text-foreground">
                  {item.name}
                </p>
                <p className="mt-2 text-[0.9rem] leading-[1.7] break-keep text-foreground/65">
                  {item.summary}
                </p>

                <ul className="mt-6 space-y-2.5">
                  {item.includes.map((line) => (
                    <li
                      key={line}
                      className="flex items-start gap-2.5 text-[0.9rem] leading-[1.6] break-keep text-foreground/80"
                    >
                      <Check
                        aria-hidden
                        strokeWidth={3}
                        className="mt-0.5 size-4 shrink-0 text-accent"
                      />
                      {line}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-8">
                  <p className="font-display text-fluid-xl font-bold tracking-tight text-accent">
                    {item.price}
                  </p>
                  <p className="mt-1.5 text-[0.8rem] leading-[1.6] break-keep text-foreground/55">
                    {item.priceNote}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>

        {/* 통합 패키지 — 제안서가 가장 앞에 미는 구성이라 따로 세운다.
            왼쪽 어두운 칸이 "무엇을 왜", 오른쪽 흰 칸이 "무엇으로". */}
        <Reveal delay={80}>
          <div className="mt-5 grid overflow-hidden rounded-2xl border border-line lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
            <div className="bg-abyss p-8 sm:p-10">
              <p className="inline-flex items-center rounded-full bg-[#acd4ff] px-3.5 py-1.5 text-[0.75rem] font-bold tracking-[-0.01em] text-abyss">
                {packages.bundle.badge}
              </p>
              <p className="mt-5 font-display text-fluid-xl font-bold tracking-tight text-white">
                {packages.bundle.name}
              </p>
              <p className="mt-2 text-[0.9rem] leading-[1.7] break-keep text-white/60">
                {packages.bundle.summary}
              </p>
              <p className="mt-6 font-display text-fluid-2xl font-bold tracking-tight text-[#acd4ff]">
                {packages.bundle.price}
              </p>
              <p className="mt-4 text-[0.85rem] leading-[1.8] break-keep text-white/70">
                {packages.bundle.body}
              </p>
            </div>

            <div className="bg-white p-8 sm:p-10">
              <p className="font-display text-xs font-bold tracking-[0.3em] text-accent">
                INCLUDED
              </p>
              <ul className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {packages.bundle.includes.map((line) => (
                  <li key={line.label} className="border-t border-line pt-4">
                    <p className="text-[0.95rem] font-bold break-keep text-foreground">
                      {line.label}
                    </p>
                    <p className="mt-1 text-[0.85rem] leading-[1.6] break-keep text-foreground/65">
                      {line.body}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-[0.8rem] leading-[1.7] break-keep text-foreground/55">
                {packages.bundle.note}
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <p className="mt-6 text-[0.8rem] leading-[1.7] break-keep text-foreground/55">
            {packages.note}
          </p>
        </Reveal>
      </div>

      {/* 묶음을 닫는 한 줄. 제목보다 한 급 작게 둔다 — 여는 말과 같은 크기면
          어느 쪽이 이 묶음의 머리인지 흐려진다. */}
      <Reveal delay={60}>
        <p className="mt-20 font-display text-fluid-xl font-bold tracking-tight break-keep text-foreground sm:mt-24">
          {closing}
        </p>
      </Reveal>
    </section>
  );
}
