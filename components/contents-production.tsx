import Image from "next/image";
import Reveal from "@/components/reveal";
import { PROCESS_BAND_BG } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { contentsProduction } from "@/lib/site";

/**
 * 콘텐츠 상품 본문 아래에 이어지는 묶음 둘 — 영상 제작 소개서를 옮긴 것이다.
 *
 *   MEDIA SERVICES — 만드는 영상의 갈래 넷
 *   PROCESS        — 미팅에서 납품까지 아홉 단계
 *
 * 문구는 전부 lib/site.ts의 contentsProduction에서 온다.
 *
 * 소개서 원본은 얇은 선으로 그린 겹친 원과 별이 깔린 어두운 배경을 쓰지만,
 * 이 지면은 그 문법을 따르지 않는다. 다른 네 상품 지면이 전부 흰 바탕에
 * 카드도 테두리도 없이 얹히고, 그림은 남색 그라디언트 덩어리(IMC 궤도의 구,
 * 퍼포먼스 채널 구, 흐름 바와 구슬)로 그려져 있어서다 — 이 지면만 테두리
 * 도형과 어두운 패널을 쓰면 서비스 다섯 장이 한 벌로 읽히지 않는다.
 * 그래서 소개서의 "무엇을 말하는지"는 그대로 두고, "무엇으로 그리는지"만
 * 이 사이트의 것으로 바꿨다:
 *
 *   겹친 테두리 원 넷 → 머리 실선 + 번호 + 제목 + 설명 (퍼포먼스의 강점 3가지)
 *
 * PROCESS 만은 소개서의 판형(접힌 레일)을 그대로 둔다 — 아홉 단계가 한 줄로
 * 이어지는 그림이라, 이 사이트의 흐름 바로 옮기면 두 도막으로 끊긴다.
 * 대신 배경을 별밤 사진이 아니라 이 사이트의 심해 그라디언트로 깐다.
 *
 * 색은 절대 팔레트가 아니라 역할 토큰(text-foreground 등)으로 준다 —
 * 바깥 지면이 .on-light 라 토큰이 이미 흰 배경용으로 뒤집혀 있다. 어두운
 * PROCESS 지면 '안쪽'만 예외로 흰 글자를 직접 쓴다(반전이 닿지 않는다).
 */

/**
 * 묶음 머리 — 영문 라벨 + 헤어라인, 그 아래 제목과 설명.
 *
 * 라벨 문법은 performance-funnel.tsx의 PERFORMANCE PROCESS와, 제목/설명의
 * 위계는 WHY DIVERZ 벤토 머리와 같다. 한 지면 안에서 묶음 머리가 두 벌로
 * 보이면 안 된다.
 */
function BlockHeading({
  label,
  title,
  body,
  dark = false,
}: {
  /**
   * 영문 라벨. 없으면 라벨 줄(라벨 + 헤어라인)째로 빠지고 제목부터 시작한다.
   *
   * 첫 묶음(MEDIA SERVICES)이 그렇다 — 바로 위에 탭("영상 제작")이 서 있어서,
   * 그 아래 라벨 줄을 한 번 더 그으면 같은 자리에 경계가 두 겹 생긴다.
   * 어디서부터 새 묶음인지는 탭이 이미 말해 준다.
   */
  label?: string;
  /** 굵은 한 줄. PROCESS처럼 제목 없이 설명만 오는 묶음도 있다. */
  title?: string;
  body: string;
  /**
   * 어두운 지면(PROCESS) 위에 얹을 때.
   *
   * 그 안쪽은 이 페이지의 .on-light 반전이 닿지 않는 자리라 역할 토큰이
   * 흰 배경용 값을 그대로 내놓는다 — 색을 직접 준다. 액센트는 어두운
   * 배경용 값(#acd4ff)으로 되돌린다.
   */
  dark?: boolean;
}) {
  return (
    <>
      {label && (
        <Reveal>
          <div className="flex items-center gap-4">
            <p
              className={cn(
                "font-display text-xs font-bold tracking-[0.25em]",
                dark ? "text-[#acd4ff]" : "text-accent",
              )}
            >
              {label}
            </p>
            <span
              aria-hidden
              className={cn(
                "h-px flex-1",
                dark ? "bg-white/15" : "bg-foreground/10",
              )}
            />
          </div>
        </Reveal>
      )}

      {title && (
        <Reveal delay={60}>
          {/* 크기(text-fluid-2xl)와 글자색을 cn() 한 번에 넘기지 않는다 —
              tailwind-merge 는 이 프로젝트가 따로 등록한 text-fluid-* 를
              모르는 탓에 "글자색"으로 분류하고, 뒤에 오는 text-foreground 에
              밀려 통째로 지워 버린다(제목이 16px로 주저앉는다). 크기는 고정
              문자열에 두고 색만 끼워 넣는다. */}
          {/* whitespace-pre-line — 문구에 넣어 둔 줄바꿈(\n)을 그대로 살린다.
              자연 개행에 맡기면 화면 폭에 따라 끊기는 자리가 매번 달라진다. */}
          <h3
            className={`font-display text-fluid-2xl font-bold tracking-tight break-keep whitespace-pre-line ${
              label ? "mt-7" : ""
            } ${dark ? "text-white" : "text-foreground"}`}
          >
            {title}
          </h3>
        </Reveal>
      )}

      <Reveal delay={title ? 90 : 60}>
        {/* max-w-2xl — 컬럼 폭을 다 쓰면 한 줄이 너무 길어진다.
            ServiceSection의 설명글과 같은 규칙이다. */}
        {/* 위 h3 과 같은 이유로 cn() 을 쓰지 않는다.
            whitespace-pre-line — 문구에 넣어 둔 줄바꿈을 살린다. */}
        <p
          className={`max-w-2xl text-fluid-base leading-relaxed break-keep whitespace-pre-line ${
            dark ? "text-white/60" : "text-foreground/55"
          } ${title ? "mt-3" : "mt-4"}`}
        >
          {body}
        </p>
      </Reveal>
    </>
  );
}

/** MEDIA SERVICES — 갈래 넷. */
function Genres() {
  const { title, body, items } = contentsProduction.genres;

  return (
    <div>
      {/* 라벨 줄은 두지 않는다 — 바로 위 탭("영상 제작")이 이미 이 묶음의
          시작을 긋고 있다(BlockHeading 의 label 주석 참고). */}
      <BlockHeading title={title} body={body} />

      {/* 갈래마다 판 하나. 예전에는 실선 윗변 + 글만으로 넷을 갈랐는데,
          이 묶음이 파는 건 "무엇을 만들어 주는가"라서 글보다 결과물이 먼저
          보여야 한다. 사진을 위에 얹고 글을 아래에 받치는 판으로 바꿨다.

          흰 지면 위의 흰 판이라 경계는 가는 테두리가 맡는다(그림자만으로는
          밝기 낮은 화면에서 칸이 서지 않는다). 사진이 판 윗변에 딱 맞게
          잘리도록 바깥 상자에 overflow-hidden 을 건다. */}
      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:mt-14">
        {items.map((item, i) => (
          <Reveal as="li" key={item.name} delay={i * 70}>
            <article className="group h-full overflow-hidden rounded-[20px] border border-line bg-white transition-shadow duration-300 hover:shadow-[0_14px_32px_-14px_rgb(10_21_38/0.18)]">
              {/* 4:3 — 넷이 한 줄에 설 때 판이 세로로 길어지지 않는 비율.
                  넉 장의 원본 비율이 제각각이라 object-cover 로 맞춘다.

                  한 줄에 한 장씩 쌓이는 좁은 화면에서는 16:9 로 눕힌다 —
                  칸 폭이 곧 화면 폭이라 4:3 이면 사진 한 장이 280px 을
                  넘어가고, 넉 장이 세로로 이어지면 이 묶음만 화면 여러 장을
                  먹는다. */}
              <div className="relative aspect-[16/9] overflow-hidden bg-surface sm:aspect-[4/3]">
                <Image
                  src={item.image}
                  alt=""
                  aria-hidden
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>

              <div className="p-5 sm:p-6">
                <p className="font-display text-[0.78rem] font-bold tracking-[0.2em] text-accent tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h4 className="mt-2 font-display text-fluid-lg font-bold tracking-tight break-keep text-foreground">
                  {item.name}
                </h4>
                <p className="mt-3 text-fluid-base leading-relaxed break-keep text-foreground/55">
                  {item.body}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}

/**
 * PROCESS — 아홉 단계.
 *
 * 이 묶음만 소개서의 판형을 그대로 쓴다 — 어두운 지면 위에 레일 하나가
 * 위 다섯 단계를 지나 오른쪽에서 접혀 내려와 아래 넷을 되짚는다. 한때
 * 다른 묶음처럼 흰 바탕의 흐름 바 두 줄로 바꿔 봤는데, 아홉 단계가 두
 * 도막으로 끊겨 "한 번에 이어지는 공정"이라는 이 그림의 뜻이 사라졌다.
 * 접힌 레일은 그 뜻을 한 줄로 유지하는 유일한 판형이다.
 *
 * 배경은 심해 그라디언트다(수심 스케일 deep → abyss, 오른쪽 위가 옅다) —
 * 소개서의 별밤 배경 자리를 이 사이트의 색으로 채운 것이다. 어두운 바탕은
 * 이 지면에서 여기 한 곳뿐이라, 아래 배너·푸터로 이어지는 어두운 톤의
 * 예고처럼 읽힌다.
 */
function Process() {
  const { body, steps } = contentsProduction.process;
  /* 위 다섯 · 아래 넷. 데이터 순서를 그대로 5:4로 접는다 —
     lib/site.ts의 steps에 단계를 더하거나 빼면 이 자리도 같이 본다. */
  const top = steps.slice(0, 5);
  /* 아래 줄은 오른쪽에서 왼쪽으로 되짚어 온다. 화면에 왼쪽부터 그리려면
     순서를 뒤집어야 한다(촬영이 오른쪽 끝). */
  const bottom = steps.slice(5).slice().reverse();

  /* 레일 위에 앉는 구슬. 어두운 바탕이라 흰색으로 박고 옅은 빛을 두른다. */
  const bead =
    "size-2.5 shrink-0 rounded-full bg-white shadow-[0_0_14px_2px_rgb(172_212_255_/_0.55)]";

  /* 이 둘은 크기(text-fluid-lg · text-svc-body)와 색을 함께 들고 있어서
     cn() 에 넘기면 안 된다 — tailwind-merge 가 모르는 크기 클래스를 색으로
     보고 지운다(위 BlockHeading 주석 참고). 붙일 여백은 템플릿 문자열로
     이어 붙인다. */
  const stepTitle =
    "font-display text-fluid-lg font-bold tracking-tight break-keep text-white";
  const stepBody = "text-svc-body leading-relaxed break-keep text-white/55";

  return (
    <div>
      {/* 어두운 지면은 좌우 여백 밖으로 흘려 화면 끝까지 덮는다(.bleed-x) —
          컨테이너 폭에서 끊기면 지면 한가운데 놓인 상자로 보인다.
          안쪽 내용은 다시 page-container로 감싸 읽는 폭을 되돌린다.

          그라디언트는 클래스가 아니라 인라인 style로 준다 — 색 정지점이
          넷이라 Tailwind 임의값으로 적으면 한 줄이 읽히지 않는다.
          값은 수심 스케일(globals.css)의 deep(#17253c)과 abyss를 잇는
          중간색들이다. */}
      <div
        className="bleed-x py-24 sm:py-28 xl:py-32"
        style={{ backgroundImage: PROCESS_BAND_BG }}
      >
        <div className="page-container">
          <BlockHeading label="PROCESS" body={body} dark />

          {/* 넓은 화면 — 레일 하나가 위 다섯을 지나 오른쪽에서 접혀 내려와
              아래 넷을 되짚는다. 여섯 칸 격자를 위아래가 같이 쓴다:
              위는 1~5칸(여섯째 칸은 접히는 자리로 비운다), 아래는 2~5칸
              (첫 칸을 비워 위 줄과 한 칸 어긋나게 둔다 — 접힌 뒤 처음
              만나는 구슬이 촬영이 되도록 오른쪽 끝을 맞춘다). */}
          <div className="mt-16 hidden md:block xl:mt-20">
            <div
              className="relative"
              /* 레일의 위아래 간격. 위 줄 글 묶음(약 120px)이 들어가고도
                 남아야 두 줄이 서로 다른 묶음으로 읽힌다. */
              style={{ "--rail-h": "260px" } as React.CSSProperties}
            >
              {/* 레일 — 위/아래 가로선과 오른쪽에서 둘을 잇는 반원을
                  테두리 하나로 그린다. 왼쪽은 터 놓는다(border-l 없음):
                  두 줄이 컨테이너 밖에서 계속 이어지는 것처럼 보인다. */}
              <span
                aria-hidden
                className="pointer-events-none absolute top-0 right-0 h-(--rail-h) rounded-r-full border-y border-r border-white/20"
                /* 왼쪽 끝만 컨테이너 밖으로 뺀다 — 화면 가장자리에서
                   선이 들어오고 나가야 아홉 단계가 "지나가는 길" 위에
                   놓인 것으로 읽힌다. 계산은 .bleed-x(globals.css)와 같은
                   식이다: 컨테이너 여백 + 최대폭(1800px) 캡에서 남는 폭.
                   오른쪽은 컨테이너 안에 둔다 — 접히는 반원이 잘리면
                   두 줄이 이어져 보이지 않는다. */
                style={{
                  left: "calc(-1 * (var(--page-pad, 24px) + max(0px, (100vw - 1800px) / 2)))",
                }}
              />

              {/* 위 줄 — 높이를 레일과 같게 못 박아, 아래 줄의 윗변이 곧
                  레일의 아랫변이 되게 한다. */}
              <div className="relative grid h-(--rail-h) grid-cols-6">
                {top.map((step, i) => (
                  <Reveal
                    key={step.title}
                    delay={i * 70}
                    className="flex flex-col items-center px-3 text-center"
                  >
                    {/* 구슬 반지름만큼 끌어올려 레일 선 위에 앉힌다. */}
                    <span aria-hidden className={cn(bead, "-mt-[5px]")} />
                    <h4 className={`${stepTitle} mt-7`}>{step.title}</h4>
                    <p className={`${stepBody} mt-3`}>{step.body}</p>
                  </Reveal>
                ))}
              </div>

              <div className="relative grid grid-cols-6">
                {/* 첫 칸은 비운다 — 위 주석 참고. */}
                <span aria-hidden />
                {bottom.map((step, i) => (
                  <Reveal
                    key={step.title}
                    delay={i * 70}
                    className="flex flex-col items-center px-3 text-center"
                  >
                    <span aria-hidden className={cn(bead, "-mt-[5px]")} />
                    <h4 className={`${stepTitle} mt-7`}>{step.title}</h4>
                    <p className={`${stepBody} mt-3`}>{step.body}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>

          {/* 좁은 화면 — 세로 타임라인. 가로 레일은 여섯 칸이 서지 않는
              폭에서 옆으로 긁어야만 다음 단계가 보인다
              (performance-funnel.tsx가 같은 이유로 두 판형을 둔다). */}
          <div className="mt-12 md:hidden">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 40} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span aria-hidden className={cn(bead, "mt-2")} />
                  {i < steps.length - 1 && (
                    <span aria-hidden className="mt-2 w-px flex-1 bg-white/20" />
                  )}
                </div>
                {/* 아래 여백은 이 칸에 준다 — Reveal(=flex 컨테이너)에 주면
                    왼쪽 세로선의 flex-1 이 그 여백까지 늘지 못해 구슬 사이가
                    끊긴다. */}
                <div className={cn(i < steps.length - 1 && "pb-8")}>
                  <h4 className={stepTitle}>{step.title}</h4>
                  <p className={`${stepBody} mt-1.5`}>{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContentsProduction() {
  /* section-stack — 사이에만 여백이 들어가고 첫 묶음 위에는 걸리지 않는다.
     예전에는 세 묶음이 각자 .section-gap 을 들고 있었는데, 이 묶음이 탭
     안으로 들어가면서(components/contents-tabs.tsx) 첫 묶음의 위 여백이
     탭이 이미 벌려 둔 자리에 한 번 더 얹혔다. */
  return (
    <div className="section-stack">
      <Genres />
      <Process />
    </div>
  );
}
