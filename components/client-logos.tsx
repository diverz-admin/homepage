import Reveal from "@/components/reveal";
import { clientLogos } from "@/lib/site";
import GradientLine from "@/components/gradient-line";
import { cn } from "@/lib/utils";

/**
 * clientLogos를 3줄로 고르게 나눈다. i % 3으로 돌려 담으면 원래 배열의
 * (이미 섞어 둔) 순서가 줄마다 골고루 흩어진다 — 앞쪽 로고가 전부 첫 줄에
 * 몰리지 않는다.
 */
function splitIntoRows<T>(items: readonly T[], rows: number): T[][] {
  const result: T[][] = Array.from({ length: rows }, () => []);
  items.forEach((item, i) => result[i % rows].push(item));
  return result;
}

const ROWS = splitIntoRows(clientLogos, 3);
/** 줄마다 속도를 조금씩 달리해야 나란히 흘러도 기계적으로 안 보인다. */
const ROW_SPEED = [46, 38, 52];

function LogoCard({ logo }: { logo: (typeof clientLogos)[number] }) {
  return (
    <div className="flex aspect-[16/7] w-[150px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_14px_rgb(15_42_77/0.07)] sm:w-[180px]">
      {/* 원본 PNG마다 투명 여백이 넉넉히 남아 있어 그대로 채우면 로고가
          작아 보인다. 살짝 확대해 여백을 카드 밖으로 밀어내고,
          overflow-hidden(위)이 둥근 모서리 밖으로 나간 부분을 잘라낸다. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo.src}
        alt={logo.name}
        loading="lazy"
        decoding="async"
        className="h-full w-full scale-[1.4] object-contain"
      />
    </div>
  );
}

function MarqueeRow({
  items,
  reverse,
  duration,
}: {
  items: (typeof clientLogos)[number][];
  reverse?: boolean;
  duration: number;
}) {
  // 이어붙이기용으로 리스트를 두 벌 늘어놓고 -50%까지 옮기면 끊김 없이
  // 반복된다. 스크린리더에는 한 벌만 있는 것처럼 들리게 뒤 절반을 숨긴다.
  const doubled = [...items, ...items];
  return (
    <div className="marquee-row overflow-hidden">
      <div
        aria-hidden
        className={cn(
          "flex w-max gap-4 sm:gap-5",
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        )}
        style={{ animationDuration: `${duration}s` }}
      >
        {doubled.map((logo, i) => (
          <LogoCard key={`${logo.name}-${i}`} logo={logo} />
        ))}
      </div>
    </div>
  );
}

/** 함께한 클라이언트 로고 월 — CLIENTS 바로 다음에 온다. */
export default function ClientLogos() {
  return (
    <section className="relative overflow-hidden bg-white pb-32 pt-24 sm:pb-44 sm:pt-32">
      <div className="page-container">
        <Reveal>
          <p className="text-center font-display text-xs font-bold tracking-[0.35em] text-mid">
            PARTNERS
          </p>
        </Reveal>
        <Reveal delay={100}>
          {/* 흰 배경 섹션이라 글자색을 직접 준다. 예전에는 GradientLine이
              색까지 입혀 줬지만, 지금은 줄만 끊고 색은 부모를 따른다.
              여기는 .on-light 밖이라 기본 foreground가 밝은 색이어서
              색을 안 주면 흰 배경에 묻힌다. */}
          <h2 className="mt-5 text-center font-display text-fluid-2xl font-bold leading-tight tracking-tight text-abyss">
            <GradientLine>수많은 브랜드가 다이버즈와 함께 성장하고 있습니다</GradientLine>
          </h2>
        </Reveal>
      </div>

      {/* 마퀴는 컨테이너 폭에 갇히면 안 되므로(가로로 끝없이 흐른다)
          page-container 바깥, 화면 폭 그대로 둔다. 양옆은 흰 배경으로
          자연히 페이드되도록 마스크만 살짝 준다. */}
      <div
        className="mt-16 space-y-4 sm:mt-20 sm:space-y-5"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)",
        }}
      >
        {ROWS.map((row, i) => (
          <MarqueeRow
            key={i}
            items={row}
            reverse={i % 2 === 1}
            duration={ROW_SPEED[i % ROW_SPEED.length]}
          />
        ))}
      </div>

      {/* 시각적으로는 숨긴 마퀴 대신, 실제 목록은 여기 한 번만 노출한다. */}
      <ul className="sr-only">
        {clientLogos.map((logo) => (
          <li key={logo.name}>{logo.name}</li>
        ))}
      </ul>
    </section>
  );
}
