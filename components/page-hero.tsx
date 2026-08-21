import Bubbles from "@/components/bubbles";
import Reveal from "@/components/reveal";
import Typewriter from "@/components/ui/typewriter";
import FlipWords from "@/components/ui/flip-words";

type Props = {
  /** 생략하면 아이브로우 줄 자체가 렌더되지 않는다. */
  eyebrow?: string;
  title: React.ReactNode;
  /** "\n"으로 줄을 나누면 그대로 줄바꿈된다. */
  description?: string;
  /**
   * 넘기면 맨 위에 타이핑 줄이 하나 붙고 히어로 전체가 가운데 정렬로 바뀐다.
   * PageHero는 하위 5개 페이지 공용이라 기본값은 꺼짐 — 켠 페이지에만 나온다.
   */
  typed?: {
    prefix?: string;
    texts: readonly string[];
  };
  /**
   * typed 대신 쓰는 단어 교체 효과. 같은 자리를 쓰므로 둘 중 하나만 넘긴다.
   * typed는 한 글자씩 치고 지우고, 이쪽은 통째로 흐려지며 바뀐다.
   */
  flipWords?: {
    words: readonly string[];
    /** 교체 주기(ms). */
    duration?: number;
  };
  /**
   * 흰 배경 변형. 서비스 페이지처럼 페이지 전체가 화이트일 때 켠다.
   * 색 역할이 통째로 뒤집히고, 기포는 흰 배경에서 보이지 않으므로 걷어낸다.
   */
  light?: boolean;
  /**
   * typed/flipWords 없이도 가운데 정렬을 켜고 싶을 때 쓴다.
   * typed나 flipWords를 넘기면 이 값과 무관하게 항상 가운데 정렬된다.
   */
  center?: boolean;
  /**
   * 제목 위·설명 아래 "눈에 보이는" 여백을 맞춘다.
   * SiteHeader가 fixed(h-20=80px)로 섹션 위에 겹쳐 있어서, pt를 pb와
   * 같은 값으로 줘도 그만큼 header에 가려 위쪽 여백이 더 좁아 보인다.
   * 그래서 pt = pb + 헤더 높이(5rem)로 준다.
   */
  equalPadding?: boolean;
  /**
   * 제목에 진입 페이드업 애니메이션을 켠다. 기본값 꺼짐 — PageHero는
   * 하위 5개 페이지 공용이라, 켠 페이지에만 나온다.
   */
  titleReveal?: boolean;
  /**
   * equalPadding의 낮은 버전. 위·아래 "눈에 보이는" 여백을 맞추면서
   * 히어로 전체 높이는 기본값보다 낮춘다(work처럼 본문이 바로 이어지는
   * 페이지용). equalPadding과 같이 주면 이쪽이 무시된다.
   */
  compact?: boolean;
  /**
   * 히어로 아래 구분선을 끈다. 히어로와 본문 배경이 같은 페이지(work)에서는
   * 선 하나만 떠 보여서 지운다. 배경이 바뀌는 페이지는 켜 둔 채로 둔다.
   */
  borderless?: boolean;
};

/** 하위 페이지 공통 헤더. 히어로보다 얕은 수심 느낌. */
export default function PageHero({
  eyebrow,
  title,
  description,
  typed,
  flipWords,
  light = false,
  center = false,
  equalPadding = false,
  compact = false,
  borderless = false,
  titleReveal = false,
}: Props) {
  const centered = Boolean(typed || flipWords || center);
  return (
    /* 배경 효과는 떠오르는 기포만 남긴다.
       (이전엔 god-rays 대각선 광선 + deep→abyss 세로 그라디언트가 겹쳐 있었다) */
    <section
      className={`relative overflow-hidden ${borderless ? "" : "border-b"} ${
        typed || flipWords
          // typed/flipWords 줄 자체가 py-10/14 여백을 이미 갖고 있어서,
          // 그만큼을 빼야 위아래 "눈에 보이는" 여백이 맞는다.
          // pt는 고정 헤더(h-20 = 80px)를 넘겨야 제목이 가리지 않는다.
          ? "pt-28 pb-20 sm:pt-32 sm:pb-24"
          : equalPadding
          ? "pt-[15rem] pb-40 sm:pt-[17rem] sm:pb-48"
          : compact
          // pt = pb + 헤더 높이(5rem). equalPadding과 계산은 같고 값만 낮다.
          ? "pt-36 pb-16 sm:pt-40 sm:pb-20"
          : "pt-40 pb-32 sm:pt-48 sm:pb-44"
      } ${light ? "bg-white border-abyss/10" : "border-line"}`}
    >
      {!light && <Bubbles />}
      <div className={`relative page-container ${centered ? "text-center" : ""}`}>
        {/* 크기·행간을 인라인 style로 준다.
            - 행간: globals.css의 `p { line-height: 1.7 }`가 레이어 밖에 있어
              Tailwind의 leading-* 유틸리티를 이긴다. 클래스로는 못 맞춘다.
            - 크기: 좁은 화면의 상한(2.6rem)은 그대로 두고 하한만 1.1 → 1.5rem,
              증가율만 4 → 7vw로 올렸다. 모바일에서 4vw는 500px 화면에서 20px밖에
              안 돼 히어로 첫 줄치고 너무 작았다. 상한을 건드리지 않는 게 중요한데,
              가장 긴 문구("Performance Marketing")가 두 줄로 접히면 그 두 줄
              높이를 미리 잡느라 짧은 문구일 때 빈 줄이 생기기 때문이다. */}
        {flipWords && (
          <p
            style={{ lineHeight: 1.1 }}
            className={`py-10 font-display text-[clamp(1.5rem,7vw,2.6rem)] font-bold tracking-tight sm:py-14 sm:text-[clamp(1.1rem,4.4vw,2.9rem)] ${
              light ? "text-mid" : "text-accent"
            }`}
          >
            <FlipWords
              words={[...flipWords.words]}
              duration={flipWords.duration}
            />
          </p>
        )}

        {typed && (
          <p
            style={{ lineHeight: 1.1 }}
            className={`py-10 font-display text-[clamp(1.5rem,7vw,2.6rem)] font-bold tracking-tight sm:py-14 sm:text-[clamp(1.1rem,4.4vw,2.9rem)] ${
              light ? "text-mid" : "text-accent"
            }`}
          >
            <Typewriter
              prefix={typed.prefix}
              texts={[...typed.texts]}
              typedClassName={light ? "text-mid" : "text-accent"}
              cursorClassName={light ? "text-accent" : "text-accent-soft"}
              align="center"
            />
          </p>
        )}

        {eyebrow && (
          <p
            className={`font-display text-xs font-bold tracking-[0.35em] ${
              light ? "text-mid" : "text-accent"
            }`}
          >
            {eyebrow}
          </p>
        )}

        {/* 제목 크기는 하위 페이지 전체가 2xl로 통일. 설명은 lg로 통일.
            cn(twMerge) 금지 — text-fluid-* 가 text-white 와 같은 그룹으로
            묶여 크기가 지워진다. */}
        {(() => {
          const heading = (
            <h1
              className={`text-balance break-keep font-display text-fluid-2xl font-semibold tracking-tight ${
                light ? "text-abyss" : "text-white"
              } ${eyebrow ? "mt-6" : ""}`}
            >
              {title}
            </h1>
          );
          return titleReveal ? <Reveal>{heading}</Reveal> : heading;
        })()}

        {description && (
          // 크기는 text-fluid-lg — 메인페이지 히어로 태그라인(ParallaxHero)과
          // 같은 톤앤매너를 쓰려고 그 토큰을 그대로 가져왔다. 예전엔 여기만
          // 독자적인 clamp(1.05rem,2.2vw,1.2rem)를 써서 다른 페이지 설명글보다
          // 커 보였다.
          //
          // text-balance — sm 미만에서는 whitespace-pre-line이 안 걸려 원문의
          // "\n"이 무시되고 자연 개행에 맡겨진다. text-pretty만으로는 줄
          // 길이가 들쭉날쭉하고 마지막 줄에 "설계하고 실행합니다."처럼 짧은
          // 꼬리가 남는다. balance는 줄 길이를 고르게 나눠 준다.
          // sm 이상에서는 원문 개행이 그대로 살아 있어 영향이 없다.
          <p
            className={`mt-8 max-w-2xl text-balance break-keep text-fluid-lg sm:whitespace-pre-line ${
              light ? "text-abyss/65" : "text-white/75"
            } ${centered ? "mx-auto" : ""}`}
          >
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
