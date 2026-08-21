import Reveal from "@/components/reveal";
import SectionNumber from "@/components/section-number";
import RankingBoard from "@/components/ranking-board";
import { placeRankings, smartstoreRankings, viralSolution } from "@/lib/site";

/**
 * 바이럴 상품 본문(01 블루에그) 아래에 이어지는 묶음 둘.
 *
 *   02 바이럴 마케팅 — 제목 → 설명 → 키워드
 *   03 리워드 마케팅 — 제목 → 설명 → 키워드 → 순위 상승 실적
 *
 * 셋 다 같은 판형으로 말한다. 예전에는 묶음마다 말하는 방식이 달라서
 * (어떤 건 문단과 알약, 어떤 건 칸 나눈 카드) 한 페이지 안에서 문법이
 * 두세 가지로 갈렸다.
 *
 * 순위 상승 실적(SMARTSTORE RANKING)은 03의 맨 아래다 — 리워드로 무엇이
 * 달라졌는지를 숫자로 닫는 자리라, 설명보다 뒤에 와야 근거로 읽힌다.
 *
 * 내용은 기존 사이트 diverz.kr/viralmarketing, diverz.kr/35 에서 옮겨 왔다.
 *
 * 색은 절대 팔레트(text-abyss 등)가 아니라 역할 토큰(text-foreground 등)을
 * 쓴다 — 패널 톤에 따라 같이 뒤집혀야 한다.
 */

/**
 * 프로그램 하나의 머리 — 번호 + 영문 라벨 + 국문 이름.
 *
 * 이름 크기는 위 블루에그 블록(ServiceSection의 h2)과 같은 text-fluid-2xl 로
 * 맞춘다. 한 지면에서 둘의 무게가 다르면 프로그램 쪽이 곁다리로 읽힌다.
 *
 * 번호는 영문 라벨 앞에 붙인다 — 줄을 따로 잡으면 머리가 세 겹으로 쌓여
 * 본문보다 무거워진다. 색은 라벨보다 흐리게 둬서 번호가 먼저 읽히지 않게 한다.
 */
function ProgramHeading({
  no,
  name,
  title,
}: {
  no: string;
  name: string;
  /** 화면에 크게 나가는 문구. 없으면 프로그램 이름을 그대로 쓴다. */
  title?: string;
}) {
  return (
    <>
      <SectionNumber no={no} />
      <Reveal delay={60}>
        <h4 className="mt-10 font-display text-fluid-2xl font-bold tracking-tight break-keep text-foreground">
          {title ?? name}
        </h4>
      </Reveal>
    </>
  );
}

export default function ViralChannels() {
  const { viral, reward } = viralSolution.programs;

  return (
    /* 테두리도 바탕면도 없이 지면에 그냥 얹는다. */
    <div className="mt-24 sm:mt-32">
      {/* 프로그램 둘. 예전에는 위에 솔루션 브랜드(블루에그) 제목이 있고
          이 둘을 왼쪽 세로선 안쪽으로 들여 써서 "저기에 매달린 갈래"임을
          보였는데, 브랜드가 페이지 제목으로 올라간 지금은 매달 상위가 이
          블록 안에 없다 — 들여쓰기를 빼고 지면에 나란히 둔다. */}
      <div className="space-y-24 sm:space-y-32">
        {/* 바이럴 마케팅 — 위 블루에그 블록과 같은 판형(제목 → 설명 → 키워드).
            예전에는 채널 카드 셋(네이버·인스타그램·당근)을 가로로 세웠는데,
            바로 위 블록이 문단과 알약으로 말하고 있어서 같은 페이지 안에서
            말하는 방식이 두 가지가 됐다. 당근은 뺐다. */}
        <section>
          <ProgramHeading no="02" name={viral.name} title={viral.title} />

          <Reveal delay={80}>
            <p className="mt-6 max-w-2xl text-fluid-lg leading-[1.85] font-normal tracking-[-0.04em] break-keep text-foreground/85">
              {viral.summary}
            </p>
          </Reveal>

          <Reveal delay={120}>
            {/* 알약 규격은 ServiceSection과 같다 — 같은 지면에서 두 벌로
                보이면 안 된다. 값을 고칠 일이 생기면 양쪽을 같이 고친다. */}
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {viral.points.map((point) => (
                <li
                  key={point}
                  className="rounded-full bg-abyss px-5 py-2.5 text-[0.95rem] font-medium break-keep text-white transition-colors hover:bg-mid"
                >
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        {/* 리워드 마케팅 — 위 두 묶음과 같은 판형. 다섯 갈래를 가로로
            펴 두던 칸(브랜드 노출·보상 설계·트래픽 품질…)은 뺐다. */}
        <section>
          <ProgramHeading no="03" name={reward.name} title={reward.title} />

          <Reveal delay={80}>
            <p className="mt-6 max-w-2xl text-fluid-lg leading-[1.85] font-normal tracking-[-0.04em] break-keep text-foreground/85">
              {reward.summary}
            </p>
          </Reveal>

          <Reveal delay={120}>
            {/* 알약 규격은 위 블록들과 같다. */}
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {reward.points.map((point) => (
                <li
                  key={point}
                  className="rounded-full bg-abyss px-5 py-2.5 text-[0.95rem] font-medium break-keep text-white transition-colors hover:bg-mid"
                >
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* 순위 상승 실적은 이 묶음의 맨 아래에 둔다 — 리워드로 무엇이
              달라졌는지를 숫자로 닫는 자리다. */}
          {/* 플레이스가 위, 쇼핑이 아래. 플레이스 실적은 수치가 들어오면
              lib/site.ts 의 placeRankings 만 채우면 이 자리에 붙는다. */}
          {placeRankings.length > 0 && (
            <RankingBoard
              label="NAVER PLACE RANKING"
              channel="네이버 플레이스"
              items={placeRankings}
            />
          )}

          {/* 아래 줄은 반대 방향으로 흘린다 — 같은 방향으로 둘이 나란히
              흐르면 화면이 통째로 미끄러지는 것처럼 보인다. */}
          <RankingBoard
            label="SMARTSTORE RANKING"
            channel="네이버 쇼핑"
            items={smartstoreRankings}
            reverse
            duration={52}
          />
        </section>
      </div>
    </div>
  );
}
