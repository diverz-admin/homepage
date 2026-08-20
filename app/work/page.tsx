import type { Metadata } from "next";
import GradientLine from "@/components/gradient-line";
import PageHero from "@/components/page-hero";
import Reveal from "@/components/reveal";
import { clientLogos } from "@/lib/site";

export const metadata: Metadata = {
  title: "WORK",
  description: "다이버즈가 함께한 브랜드와 프로젝트 기록입니다.",
};

/** 한 줄에 들어가는 카드 수 — Reveal 지연을 열 단위로 묶는 데도 쓴다. */
const COLUMNS = 5;

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
        title={
          <>
            <GradientLine>브랜드의 가능성을</GradientLine>
            <GradientLine>현실의 결과로 만듭니다</GradientLine>
          </>
        }
        description={
          "다이버즈는 브랜드가 가진 고유한 가치를 발견하고,\n" +
          "전략과 실행을 통해 고객에게 닿는 경험으로 완성합니다."
        }
        center
        compact
        borderless
        titleReveal
      />

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
