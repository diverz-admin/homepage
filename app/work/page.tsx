import type { Metadata } from "next";
import CountUp from "@/components/count-up";
import GradientLine from "@/components/gradient-line";
import PageHero from "@/components/page-hero";
import Reveal from "@/components/reveal";
import { clientLogos, stats } from "@/lib/site";

export const metadata: Metadata = {
  title: "WORK",
  description: "다이버즈가 함께한 브랜드와 프로젝트 기록입니다.",
};

/** 한 줄에 들어가는 카드 수 — Reveal 지연을 열 단위로 묶는 데도 쓴다. */
const COLUMNS = 5;

/**
 * 배너 아래 성과 두 줄.
 *
 * 수치는 lib/site.ts 의 stats 를 그대로 끌어다 쓴다 — 홈(WHY DIVERZ)과 같은
 * 숫자여야 하는데, 여기에 다시 적어 두면 한쪽만 고치는 일이 반드시 생긴다.
 * 라벨은 "누적"을 뗀 짧은 국문으로 쓴다 — 수치 바로 위에 붙는 자리라
 * 짧을수록 숫자가 먼저 읽힌다.
 */
const WORK_STATS = [
  { label: "프로젝트", from: "누적 프로젝트" },
  { label: "클라이언트", from: "누적 클라이언트" },
].map((item) => {
  const stat = stats.find((s) => s.label === item.from);
  if (!stat) throw new Error(`stats에 "${item.from}"가 없다`);
  return { label: item.label, value: stat.value, suffix: stat.suffix };
});

/**
 * WORK — 로고 격자 한 장으로 끝나는 단순한 페이지.
 *
 * 페이지는 다크지만 로고 타일만 흰색이다. 로고 PNG가 "어두운 잉크 + 투명
 * 배경"이라 어두운 판에 올리면 검정 로고(HERMÈS·Porsche 등)가 통째로 사라진다.
 */
export default function WorkPage() {
  return (
    <>
      {/* who-we-are·service와 같은 히어로 — 다크 배경 + 2줄 GradientLine 제목. */}
      <PageHero
        title={<GradientLine>다이버즈와 함께한 프로젝트</GradientLine>}
        description={
          "브랜드의 목표에 맞춰 전략을 세우고\n" +
          "IMC마케팅, 퍼포먼스마케팅, 바이럴, 콘텐츠까지\n" +
          "브랜드 성장에 필요한 실행을 함께 진행해왔습니다."
        }
        center
        compact
        borderless
        titleReveal
      />

      {/* 배너 바로 아래 성과 두 줄. 라벨이 위, 수치가 아래로 크게 온다.
          화면에 들어오면 0에서 목표값까지 굴러간다(CountUp).

          히어로가 이미 아래 여백을 갖고 있어서 위 여백은 주지 않는다.
          수치는 히어로와 같은 흰색 — 이 자리는 배너의 연장이라, 홈의
          액센트 파랑을 쓰면 배너에서 떨어져 나온 다른 블록처럼 보인다. */}
      <section className="page-container pb-24 sm:pb-32">
        <Reveal>
          <dl className="flex flex-wrap justify-center gap-x-16 gap-y-10 sm:gap-x-28">
            {WORK_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <dt className="font-display text-sm font-semibold tracking-tight text-white/60 sm:text-base">
                  {stat.label}
                </dt>
                {/* tabular-nums — 굴러가는 동안 자릿수 폭이 흔들리지 않게 한다. */}
                <dd className="mt-3 font-sans text-[clamp(3rem,7vw,5.5rem)] leading-[0.95] font-bold tracking-[-0.04em] text-white tabular-nums">
                  <CountUp to={stat.value} suffix={stat.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* 격자는 컨테이너 좌우 여백만 쓰고, 타일 사이는 완전히 붙인다.
          흰 타일이 한 줄로 이어지고, 캡션만 다크 배경 위에 놓인다. */}
      {/* 위 여백은 두지 않는다 — 히어로가 이미 아래쪽 여백(compact의 pb)을
          갖고 있어서, 여기에 또 주면 히어로와 격자 사이가 두 배로 벌어진다. */}
      <section className="page-container pb-28 sm:pb-40">
        <Reveal>
          <p className="font-display text-xs font-bold tracking-[0.35em] text-accent">
            CLIENTS
          </p>
        </Reveal>

        <ul className="mt-8 grid grid-cols-2 gap-x-0 gap-y-8 sm:mt-10 md:grid-cols-3 lg:grid-cols-5">
          {clientLogos.map((logo, i) => (
            <Reveal
              as="li"
              key={logo.name}
              /* 열 위치로만 지연을 준다. 행 번호까지 더하면 아래쪽 행이
                 화면에 들어온 뒤에도 1초 가까이 비어 있게 된다. */
              delay={(i % COLUMNS) * 70}
            >
              <article className="group">
                {/* 로고 타일 — 라운드·그림자 없이 각진 흰 판.
                    타일끼리 붙어 있어서 1px 테두리로만 칸을 나눈다(테두리가
                    없으면 한 줄이 통째로 흰 덩어리로 보인다). 테두리 색은
                    페이지 배경과 같은 abyss라 칸 사이가 배경이 비치는 틈처럼
                    보이고, 격자 바깥 테두리는 배경에 묻혀 안 보인다.
                    로고 PNG는 이미 16:6 캔버스에 "잉크 면적이 같도록"
                    정규화돼 있어서 여백을 더 주지 않는다. */}
                <div className="work-tile flex aspect-[4/3] items-center justify-center border border-abyss bg-white px-5 sm:px-6">
                  {/* 원본 비율을 그대로 살려야 해서 next/image 대신 img를 쓴다. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.src}
                    alt={logo.name}
                    loading="lazy"
                    decoding="async"
                    className="work-logo max-h-full w-full object-contain"
                  />
                </div>

                {/* 캡션은 타일 밖, 다크 배경 위에 온다. */}
                <p className="mt-3 font-display text-sm font-bold tracking-tight text-white">
                  {logo.name}
                </p>
              </article>
            </Reveal>
          ))}
        </ul>
      </section>
    </>
  );
}
