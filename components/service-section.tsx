import Reveal from "@/components/reveal";
import type { services } from "@/lib/site";

/**
 * 서비스 한 종을 한 블록으로 편다.
 *
 * 서비스 페이지에서 전체 화면 패널(components/ui/story-scroll.tsx) 하나에
 * 하나씩 들어간다. 사진 없이 텍스트만으로 — 큰 제목 · 태그라인 · 키워드
 * 알약 · 설명 문단.
 *
 * 색은 대부분 역할 토큰(text-foreground, text-accent)으로 준다. 밝은 패널은
 * 바깥에서 .on-light가 씌워져 토큰이 통째로 뒤집히므로, 여기서 밝고 어두운
 * 두 벌을 따로 쓸 필요가 없다. tone은 토큰으로 안 되는 것(알약)에만 쓴다.
 */
export default function ServiceSection({
  service,
  index,
  children,
  aside,
  tone = "light",
}: {
  service: (typeof services)[number];
  /** 목록 순번(0부터). "01" 같은 번호 표기에 쓴다. */
  index: number;
  /** IMC처럼 블록 안에 더 넣을 내용이 있을 때 쓴다. */
  children?: React.ReactNode;
  /**
   * 텍스트 블록 오른쪽 빈 자리에 얹는 그래픽.
   * max-w-3xl 바깥이 넉넉해지는 xl부터만 보인다 — 그 아래에서는 컬럼이
   * 좁아 텍스트를 밀어내므로 아예 렌더하지 않는다.
   */
  aside?: React.ReactNode;
  /** 패널 배경의 밝기. 알약 색만 이 값으로 갈린다. */
  tone?: "light" | "dark";
}) {
  return (
    // scroll-mt는 고정 헤더(h-20 = 80px)만큼 앵커를 내린다.
    <section id={service.slug} className="scroll-mt-32">
      <div
        className={
          aside
            ? "grid gap-14 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center"
            : ""
        }
      >
        <div className="max-w-3xl">
          <Reveal delay={80}>
            {/* 영문 제목이 블록의 얼굴이다.
                컬럼이 좁아져 3.5vw 그대로 두면 두세 줄로 접힌다. */}
            <h2 className="flex items-baseline gap-2.5 text-balance font-display text-fluid-lg leading-[1.1] font-bold tracking-tight text-accent">
              <span className="text-foreground/30 tabular-nums" aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </span>
              {service.en}
            </h2>
          </Reveal>

          {/* 서비스마다 있을 수도, 없을 수도 있는 한 줄.
              services가 `as const`라 유니온 타입이 되므로 in 으로 좁힌다. */}
          {"tagline" in service && service.tagline && (
            <Reveal delay={110}>
              {/* 행간은 클래스가 아니라 inline style로 준다.
                  globals.css의 `p { line-height: 1.7 }`가 레이어 밖에 있어
                  Tailwind의 leading-* 유틸리티를 이긴다 — 클래스로는 못 줄인다. */}
              <p
                style={{ lineHeight: 1.05 }}
                className="mt-5 font-display text-fluid-2xl font-bold tracking-tight whitespace-pre-line text-foreground"
              >
                {service.tagline}
              </p>
            </Reveal>
          )}

          <Reveal delay={140}>
            {/* max-w-2xl — 본문이 작아서(text-fluid-sm) 컬럼 폭을 다 쓰면
                한 줄이 60자를 넘어 읽기 힘들고 줄바꿈 자리도 나빠진다.
                text-balance — 두 줄의 길이를 고르게 맞춰, 첫 줄이 꽉 차고
                "고객의" 같은 조사만 줄 끝에 남는 걸 막는다.
                break-keep — 한글 단어 중간에서 끊지 않는다. */}
            <p className="mt-5 max-w-2xl text-fluid-sm text-balance break-keep whitespace-pre-line text-foreground/65">
              {service.summary}
            </p>
          </Reveal>

          <Reveal delay={160}>
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {service.points.map((point) => (
                <li
                  key={point}
                  className={
                    tone === "dark"
                      ? "rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium text-white ring-1 ring-white/20 transition-colors hover:bg-white/20"
                      : "rounded-full bg-abyss px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-mid"
                  }
                >
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {aside && (
          <div className="hidden justify-self-end xl:block">{aside}</div>
        )}
      </div>

      {children}
    </section>
  );
}
