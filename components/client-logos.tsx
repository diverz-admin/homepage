import Reveal from "@/components/reveal";
import { clientIndustries, clientLogos } from "@/lib/site";
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
          reverse ? "animate-marquee-reverse" : "animate-marquee",
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
/**
 * 업종 이름을 네 묶음으로 나눈다. CSS 다단과 같은 방식(앞에서부터 채운다)이라
 * 22개면 6·6·6·4가 된다. 단마다 머리에 막대를 얹어야 해서 다단 대신
 * 그리드를 쓰고, 그래서 나누는 일을 여기서 직접 한다.
 */
const INDUSTRY_COLUMNS = 4;
const industryColumns = Array.from(
  { length: INDUSTRY_COLUMNS },
  (_, i) => {
    const per = Math.ceil(clientIndustries.names.length / INDUSTRY_COLUMNS);
    return clientIndustries.names.slice(i * per, (i + 1) * per);
  },
).filter((column) => column.length > 0);

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
          {/* text-balance — 좁은 화면에서 두 줄로 접힐 때 길이를 고르게
              나눈다. 안 주면 첫 줄이 꽉 차고 "있습니다"만 다음 줄에 혼자
              남는다. 넓은 화면에서는 한 줄에 들어가므로 영향이 없다.
              break-keep 은 전역 규칙이지만, 여기서는 balance 와 함께
              걸려야 어절 단위로만 나뉜다. */}
          <h2 className="mt-5 text-center font-display text-fluid-2xl font-bold leading-tight tracking-tight text-balance break-keep text-abyss">
            <GradientLine>
              수많은 브랜드가 다이버즈와 함께 성장하고 있습니다
            </GradientLine>
          </h2>
        </Reveal>

        {/* 담당 업종. 로고 월 바로 위에 둬서 "얼마나 넓게 다루는가"를 먼저
            읽히고, 그다음 로고가 흘러가게 한다.

            테두리도 선도 없이 여백으로만 떼어 낸다. 위에 헤어라인을 그어
            봤는데, 제목과 목록 사이에 선이 하나 더 생기면서 지면이 층으로
            잘렸다 — 이 섹션은 제목 → 업종 → 로고가 한 흐름으로 이어지는
            쪽이 맞다.

            숫자와 목록은 같은 줄에서 출발한다(items-start). 예전에는
            items-center 라 "20+"가 목록 두 번째 줄 옆에, "100+"가 네 번째 줄
            옆에 걸려서 어느 숫자가 무엇을 가리키는지 흐렸다. */}
        <div className="mx-auto mt-24 max-w-5xl sm:mt-28">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] lg:gap-14">
            <Reveal delay={150}>
              <dl className="flex gap-10 lg:block lg:space-y-9">
                {clientIndustries.stats.map((stat) => (
                  <div key={stat.label} className="min-w-[7rem] flex-1 lg:w-full">
                    <dt className="text-xs font-bold tracking-[0.1em] text-abyss/45">
                      {stat.label}
                    </dt>
                    <dd className="mt-1.5 font-display text-fluid-2xl leading-none font-bold tracking-tight text-abyss tabular-nums">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={210}>
              {/* 단마다 머리에 두 톤 막대를 얹는다 — 앞 38%만 짙게 끊어 두면
                  선 하나로도 단의 시작점이 분명해진다. 예전 업종별 클라이언트
                  목록에서 쓰던 장치를 그대로 가져왔다.

                  CSS 다단(columns)으로는 단마다 머리를 붙일 수 없어서
                  묶음을 미리 나눠 그리드로 편다. 나누는 방식은 다단과 같다
                  (앞에서부터 채운다) — 22개면 6·6·6·4.

                  가장 좁은 화면에서도 2열을 유지한다. 1열로 떨어뜨려 봤는데
                  스물두 줄이 세로로 늘어서면서 이 블록 하나가 모바일 한
                  화면을 훌쩍 넘겼다 — 로고 월까지 가는 스크롤이 길어진다.
                  2열이면 절반이고, 이름이 긴 항목(인쇄/문구/사무기기)은
                  break-keep 규칙에 따라 두 줄로 접힌다. */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-10 lg:grid-cols-4">
                {industryColumns.map((column) => (
                  <div key={column[0]}>
                    <span
                      aria-hidden
                      className="block h-[3px] w-full bg-[linear-gradient(90deg,var(--ocean-deep)_0_38%,var(--ocean-shallow)_38%_100%)]"
                    />
                    <ul className="mt-5">
                      {column.map((name) => (
                        <li
                          key={name}
                          className="mb-2.5 text-[0.9rem] break-keep text-abyss/70"
                        >
                          {name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
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
