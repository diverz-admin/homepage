import Reveal from "@/components/reveal";

/**
 * 묶음 머리에 놓는 번호 + 헤어라인.
 *
 *   01 ─────────────────────────────────────────
 *
 * 바이럴처럼 한 페이지에 순서 있는 묶음이 여럿일 때, 어디서 다음 묶음이
 * 시작하는지 눈에 잡히게 하는 장치다. 예전에는 번호만 있고 묶음 사이가
 * 여백뿐이라, 스크롤하면 세 묶음이 한 덩어리로 흘렀다.
 *
 * 선은 칸을 나누는 테두리가 아니라 "여기서부터 새 묶음"이라는 표시라,
 * 오른쪽으로 갈수록 흐려져 사라진다 — 홈의 CASE 01 표기와 같은 문법이다.
 *
 * 번호 규격(크기·자간·색)은 이 한 곳에서만 정한다. 예전에는 ServiceSection과
 * ViralChannels 두 곳에 같은 값을 적어 두고 "고칠 때 같이 고치라"는 주석을
 * 달아 뒀는데, 그런 약속은 지켜지지 않는다.
 */
export default function SectionNumber({ no }: { no: string }) {
  return (
    <Reveal>
      <div className="flex items-center gap-5">
        <p className="font-display text-[clamp(1.5rem,2.6vw,2.1rem)] leading-none font-bold tracking-[0.02em] text-accent tabular-nums">
          {no}
        </p>
        <span
          aria-hidden
          className="h-px flex-1 bg-gradient-to-r from-accent/35 to-transparent"
        />
      </div>
    </Reveal>
  );
}
