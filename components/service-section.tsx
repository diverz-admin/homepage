import Link from "next/link";

import Reveal from "@/components/reveal";
import RiseReveal from "@/components/rise-reveal";
import SectionNumber from "@/components/section-number";
import type { services } from "@/lib/site";

/**
 * 서비스 한 종을 흰 지면 위에 편다.
 *
 * 큰 제목 → 설명 → ✽ 목록 → 문의 링크. 오른쪽에는 그 상품을
 * 설명하는 그래픽이 선다.
 *
 * 예전에는 제목 위에 "(01) IMC MARKETING" 한 줄이 있었다. 위쪽 메뉴가 이미
 * 다섯 상품을 순서대로 보여 주고 있어서 번호가 같은 말을 두 번 하는 셈이었고,
 * 영문 라벨도 바로 아래 국문 제목과 내용이 겹쳤다. 한때 이 묶음을 어두운 카드로 감싸 봤는데, 지면이
 * 이미 흰 여백으로 넉넉해서 상자가 오히려 답답했다 — 상자를 걷고 여백으로만
 * 구분한다.
 *
 * 딸린 블록(children — IMC 프로세스, 퍼포먼스 성과 곡선 등)은 이 아래에
 * 그대로 이어 붙는다.
 *
 * 색은 역할 토큰(text-foreground, text-accent)으로만 준다. 바깥 섹션이
 * .on-light라 토큰이 통째로 흰 배경용으로 뒤집혀 있다.
 */
export default function ServiceSection({
  service,
  no,
  children,
  aside,
  asideBleed = false,
  riseReveal = false,
  unwrapped = false,
  lead,
}: {
  service: (typeof services)[number];
  /**
   * 제목 위에 크게 얹는 순번("01").
   *
   * 한 상품 안에 '순서 있는' 묶음이 여럿일 때만 넘긴다. 묶음이 하나뿐이거나
   * 나란한 갈래일 뿐인 상품에 붙이면 없는 순서를 있다고 말하게 된다.
   *
   * 지금은 아무 상품도 넘기지 않는다. 마지막으로 쓰던 바이럴이
   * (블루에그 01 → 바이럴 마케팅 02 → 리워드 03) 뒤의 둘을 탭으로 가르면서
   * 번호를 걷었기 때문이다(components/viral-program-tabs.tsx).
   */
  no?: string;
  /** IMC처럼 아래에 더 넣을 내용이 있을 때 쓴다. */
  children?: React.ReactNode;
  /**
   * 그래픽. md 이상에서는 제목 오른쪽, 그 아래에서는 본문 밑에 놓인다.
   *
   * 한동안 좁은 화면에서 아예 감췄는데, 그 결과 노트북(1280px 미만)과
   * 모바일에서 다섯 상품 전부 그림이 없는 페이지가 됐다. 개념도는 이
   * 페이지에서 상품이 무엇을 묶는지 말해 주는 유일한 그림이라, 좁아지면
   * 자리를 옮길 일이지 뺄 일이 아니다.
   */
  aside?: React.ReactNode;
  /**
   * 그래픽을 화면 오른쪽 끝까지 흘려보낼지.
   *
   * 블루에그처럼 "화면 안을 읽어야 하는" 그림은 칸 안에 얌전히 들어가면
   * 너무 작다. 켜면 그래픽 칸이 본문보다 넓어지고, 컨테이너 여백 밖으로
   * 빠져나가 화면 끝에 닿는다(.bleed-right-xl). 넘친 부분은 페이지 쪽에서
   * overflow-x: clip 으로 잘라 준다. 2단이 아닌 구간에서는 걸리지 않는다 —
   * 그래픽이 한 단을 다 쓰는데 오른쪽으로 빼면 그냥 잘린다.
   */
  asideBleed?: boolean;
  /**
   * 제목+개념도 칸을 화면에 붙여 두고, 그 아래 딸린 블록(children)이
   * 화면 밑에서 솟아올라 그 위를 덮게 한다(components/rise-reveal.tsx —
   * hwacheon.com/ko/media/news 히어로 참고). children이 있을 때만 뜻이
   * 있어서, 지금은 글로벌(GlobalMarketingTabs)에만 켠다.
   */
  riseReveal?: boolean;
  /**
   * 바깥에서 이미 <section id={slug}>로 감쌌을 때 켠다 — 여기서 또 감싸면
   * 같은 id가 문서에 둘 생긴다.
   *
   * 바이럴이 그렇다. 그 지면은 상품 본문(블루에그)이 탭 셋 중 하나로
   * 들어가 있어서, 앵커가 될 <section>은 탭 바깥에 서 있어야 한다 —
   * 탭을 갈아타면 이 본문이 통째로 언마운트되는데, 그때 id까지 사라지면
   * 상품 메뉴가 잡을 자리가 없어진다(components/keep-section-in-view.tsx).
   */
  unwrapped?: boolean;
  /**
   * 제목 위 영문 라벨 자리에 대신 세우는 공감 한 줄.
   *
   * 바이럴처럼 이 본문이 탭 안에 들어가는 지면에서 쓴다. 거기서는 어느
   * 상품 이야기인지 활성 탭이 이미 말해 주므로 이름표(영문 라벨)가 같은
   * 말을 두 번 하는 자리가 된다 — 그 자리를 읽는 사람의 마음을 먼저 받는
   * 문장에 내준다. 글로벌 마케팅의 두 탭과 같은 규격이다
   * (components/ecommerce-marketing.tsx · hospital-marketing.tsx).
   */
  lead?: string;
}) {
  const grid = (
    <>
      {/* 번호는 본문 칸이 아니라 그리드 위에 둔다 — 선이 그래픽 칸까지
          가로질러야 "여기서부터 이 묶음"이 폭 전체로 읽힌다. */}
      {no && (
        <div className="mb-10">
          <SectionNumber no={no} />
        </div>
      )}

      <div
        className={
          aside
            ? /* 두 칸 다 비율(fr)로 잡는다. 예전에는 그래픽 칸을 34rem(544px)
                 으로 못 박아 뒀는데, 이 칸은 화면이 좁아져도 줄지 않아서 남는
                 폭을 전부 본문에서 빼앗았다 — 1619px에서 본문이 306px,
                 1280px에서는 31px까지 눌려 제목이 글자 단위로 깨졌다.
                 그래픽은 어차피 자체 max-width(460~540px)가 있어 fr 로 둬도
                 필요 이상 커지지 않는다.

                 md(768px)부터 2단으로 편다. 그래픽은 제목 오른쪽 위에 서야
                 "이 상품이 무엇을 묶는지"가 제목과 같이 읽힌다 — 본문 끝까지
                 내려가서야 나오면 다 읽고 난 뒤에 도착한다.
                 메뉴가 본문 위로 올라간 뒤로는(app/service/[slug]/page.tsx)
                 어느 폭에서든 이 2단이 지면 전체를 쓴다.

                 md 미만에서는 한 단으로 쌓되 그래픽이 맨 위로 온다(order-first).
                 본문 끝에 두면 제목·설명·키워드·문의하기를 다 지나서야 나와서,
                 그림이 무엇에 대한 그림인지 놓친다. 제목 옆에 세워도 봤는데
                 그러면 그림이 130px까지 눌려 안이 안 읽혔다.

                 비율을 1.3:1 로 기울이고 xl 구간의 간격을 좁힌 건 메뉴가
                 왼쪽 세로 칸이던 시절 1280px에서 본문이 340px까지 눌려 제목이
                 세 줄로 밀렸기 때문이다. 메뉴가 위로 올라가 그 폭이 본문 몫이
                 된 지금은 여유가 있지만, 본문이 그래픽보다 넓은 비율 자체는
                 그대로 둔다 — 읽는 쪽이 주인이다. */
              asideBleed
              ? /* 흘려보낼 때는 비율을 그래픽 쪽으로 기울인다. 오른쪽으로
                     한 번 더 벌어지므로 본문이 지나치게 눌리지 않게 1:1 로 둔다. */
                "grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start xl:gap-10 2xl:gap-16"
              : "grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-start md:gap-12 xl:gap-10 2xl:gap-16"
            : ""
        }
      >
        <div>
          <Reveal delay={40}>
            {/* 제목 위 한 줄. 기본은 영문 라벨이고, 다른 블록(WHY DIVERZ,
                WHAT IS IMC …)과 같은 라벨 문법(작게, 넓은 자간, 액센트 색)으로
                맞춘다. lead 가 오면 그 자리를 공감 한 줄에 내준다 — 이름표가
                아니라 문장이라 제목 바로 아래 급으로 세우고, 액센트 색으로
                제목과 무게를 가른다(위 prop 주석 참고). */}
            {lead ? (
              <p className="text-fluid-lg font-bold tracking-[-0.02em] break-keep text-accent">
                {lead}
              </p>
            ) : (
              <p className="font-display text-xs font-bold tracking-[0.25em] text-accent">
                {service.en}
              </p>
            )}
          </Reveal>

          <Reveal delay={80}>
            {/* 행간은 클래스가 아니라 inline style로 준다.
                globals.css의 `p { line-height: 1.7 }`가 레이어 밖에 있어
                Tailwind의 leading-* 유틸리티를 이긴다. */}
            <h2
              style={{ lineHeight: 1.15 }}
              /* 좁은 화면에서만 키운다. text-fluid-2xl 의 하한(1.5rem)이 모바일에서
                  본문(1.125rem)과 한 단계밖에 차이가 안 나 제목이 서지 않았다.
                  넓은 화면 상한(2.1rem)은 그대로다. */
              className="mt-4 font-display text-[clamp(1.9rem,3vw,2.1rem)] font-bold tracking-tight text-balance whitespace-pre-line text-foreground"
            >
              {service.tagline}
            </h2>
          </Reveal>

          <Reveal delay={120}>
            {/* 크기는 상단 배너(components/page-hero.tsx)의 설명글과 같은
                text-fluid-lg. 제목도 배너 제목과 같은 text-fluid-2xl이라,
                배너에서 여기로 내려오는 동안 글자 크기가 한 벌로 이어진다.
                max-w-2xl — 컬럼 폭을 다 쓰면 한 줄이 너무 길어진다.
                break-keep — 한글 단어 중간에서 끊지 않는다.
                tracking — body 기본값(-0.01em)보다 더 좁힌다. 이 문단만
                본문치고 큰 text-fluid-lg 라, 같은 자간이어도 글자가 커진
                만큼 사이가 벌어져 보인다. */}
            <p className="mt-4 max-w-2xl text-fluid-lg leading-[1.85] font-normal tracking-[-0.04em] break-keep text-foreground/85 md:mt-6">
              {service.summary}
            </p>
          </Reveal>

          <Reveal delay={150}>
            {/* 키워드는 알약으로 흘린다. 세로 목록으로도 써 봤는데, 퍼포먼스처럼
                항목이 여섯 개인 상품에서는 목록이 본문보다 길어져 화면 왼쪽이
                글자로만 채워졌다. 알약은 가로로 접혀서 같은 개수를 두세 줄에
                담고, 하나하나가 "키워드"로 보인다.

                흰 지면 위라 채운 알약(남색 바탕 + 흰 글자)으로 둔다 —
                테두리만 있는 알약은 옆의 본문과 무게가 비슷해 묻힌다.

                규격은 viral-channels.tsx의 알약과 같다 — 같은 지면에서 두
                벌로 보이면 안 된다. 값을 고칠 일이 생기면 양쪽을 같이 고친다. */}
            <ul className="mt-10 flex flex-wrap gap-2.5">
              {service.points.map((point) => (
                <li
                  key={point}
                  className="rounded-full bg-abyss px-5 py-2.5 text-[0.95rem] font-medium break-keep text-white transition-colors hover:bg-mid"
                >
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={180}>
            {/* 상세 페이지 안에서 다음으로 갈 곳은 결국 문의다. */}
            <Link
              href="/contact"
              className="mt-12 inline-flex items-baseline gap-2 border-b border-accent/40 pb-1.5 text-base font-bold text-accent transition-colors hover:border-accent"
            >
              문의하기
              <span aria-hidden>↗</span>
            </Link>
          </Reveal>
        </div>

        {aside && (
          /* 그래픽도 본문과 같이 위에 붙인다 — 그림의 윗선이 제목의 윗선과
             만나야 두 단이 한 줄에서 출발하는 것처럼 읽힌다.
             (grid 전체를 items-center 로 두면 본문이 그래픽 높이에 끌려
             내려가 제목과 어긋난다.) */
          <Reveal
            delay={120}
            /* bleed-right-xl 은 클래스 쪽에서 xl 미만을 걸러 낸다. */
            /* order-first — 한 단으로 쌓이는 좁은 화면에서는 그래픽이 제목
               '위'로 올라간다. 본문 뒤로 보내면 제목·설명·키워드·문의하기를
               다 지나서야 나와서, 그림이 무엇에 대한 그림인지 놓친다.
               md 부터는 2단이라 순서를 되돌린다(왼쪽 본문 / 오른쪽 그래픽). */
            className={`reveal-x order-first md:order-none md:self-start ${
              asideBleed
                ? "order-first bleed-right-xl md:order-none"
                : "order-first md:order-none"
            }`}
          >
            {aside}
          </Reveal>
        )}
      </div>
    </>
  );

  const body = riseReveal ? (
    <RiseReveal pinned={grid} panel={children} />
  ) : (
    <>
      {grid}
      {children}
    </>
  );

  if (unwrapped) return body;

  return (
    // scroll-mt는 고정 헤더(h-20 = 80px)만큼 앵커를 내린다.
    <section id={service.slug} className="scroll-mt-32">
      {body}
    </section>
  );
}
