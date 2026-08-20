import Reveal from "@/components/reveal";
import SmartstoreRanking from "@/components/smartstore-ranking";
import { searchRankingBoost, viralChannels } from "@/lib/site";

/**
 * 바이럴 블록 — 위에서 아래로 세 묶음이 쌓인다.
 *   1) VIRAL CHANNELS — 네이버·인스타그램·당근을 가로 3열로
 *   2) SEARCH RANKING BOOST — 플레이스·스마트스토어를 가로 2열로
 *   3) SMARTSTORE RANKING — 키워드별 순위 상승 그래프
 *
 * 내용은 기존 사이트 diverz.kr/viralmarketing, diverz.kr/35 에서 옮겨 왔다.
 *
 * IMC PROCESS·PERFORMANCE PROCESS와 같은 톤앤매너: 카드·테두리 없이
 * 페이지에 바로 얹고, 묶음 머리에 라벨 + 가는 선을 둔다. 칸을 나누는 건
 * 칸마다 긋는 위쪽 1px 선 하나뿐이다 — 아래 SMARTSTORE RANKING과 같은 문법.
 *
 * 색은 절대 팔레트(text-abyss 등)가 아니라 역할 토큰(text-foreground 등)을
 * 쓴다 — 패널 톤(FlowSection의 light/dark)에 따라 같이 뒤집혀야 한다.
 */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Reveal>
      <div className="flex items-center gap-4">
        <p className="font-display text-xs font-bold tracking-[0.25em] text-accent">
          {children}
        </p>
        <span aria-hidden className="h-px flex-1 bg-foreground/10" />
      </div>
    </Reveal>
  );
}

/** 가로로 늘어서는 칸 하나. 영문 채널명(+로고)이 제목 위에 온다. */
function ChannelCell({
  en,
  logo,
  children,
  delay = 0,
}: {
  en: string;
  /** 채널명 옆 마크. 원본이 없는 채널(스마트스토어)은 넘기지 않는다. */
  logo?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <Reveal as="li" delay={delay}>
      <div className="border-t border-foreground/10 pt-6">
        <div className="flex items-center gap-2.5">
          {logo && (
            /* 원본 비율을 그대로 살려야 해서 next/image 대신 img를 쓴다.
               캔버스가 정사각으로 정규화돼 있어 크기만 주면 서로 맞는다. */
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={logo}
              alt=""
              aria-hidden
              loading="lazy"
              decoding="async"
              className="size-6 shrink-0 object-contain"
            />
          )}
          <p className="font-display text-[0.8rem] font-bold tracking-[0.18em] text-accent">
            {en}
          </p>
        </div>
        <div className="mt-3">{children}</div>
      </div>
    </Reveal>
  );
}

export default function ViralChannels() {
  return (
    <>
      <div className="mt-16">
        <SectionLabel>VIRAL CHANNELS</SectionLabel>

        <ul className="mt-10 grid gap-8 sm:grid-cols-3 sm:gap-10">
          {viralChannels.map((channel, i) => (
            <ChannelCell
              key={channel.en}
              en={channel.en}
              logo={channel.logo}
              delay={i * 70}
            >
              {/* 원문의 "\n"은 한 줄로 넓게 쓸 때 끊어 둔 자리다. 3열로 서면
                  칸이 좁아 어차피 더 접히므로, 강제 개행은 빼고 맡긴다. */}
              <h3 className="font-display text-fluid-lg font-bold tracking-tight text-balance text-foreground">
                {channel.title.replace("\n", " ")}
              </h3>
              <p className="mt-3 text-fluid-sm leading-relaxed text-balance text-foreground/60">
                {channel.body}
              </p>
            </ChannelCell>
          ))}
        </ul>
      </div>

      <div className="mt-16">
        <SectionLabel>SEARCH RANKING BOOST</SectionLabel>

        <ul className="mt-10 grid gap-8 sm:grid-cols-2 sm:gap-10">
          {searchRankingBoost.map((item, i) => (
            <ChannelCell
              key={item.en}
              en={item.en}
              logo={"logo" in item ? item.logo : undefined}
              delay={i * 70}
            >
              <h3 className="font-display text-fluid-lg font-bold tracking-tight text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-fluid-sm leading-relaxed text-balance text-foreground/60">
                {item.body}
              </p>
            </ChannelCell>
          ))}
        </ul>
      </div>

      <SmartstoreRanking />
    </>
  );
}
