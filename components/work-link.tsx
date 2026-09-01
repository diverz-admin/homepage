import Link from "next/link";

/**
 * WORK 지면으로 건너가는 버튼.
 *
 * 다섯 상품 상세 지면이 모두 이 버튼을 흰 본문의 오른쪽 맨 위에 하나씩
 * 갖는다 — "이 상품이 무엇인지"를 읽다가 "그래서 실제로 뭘 했는데"로
 * 넘어가는 길이다. 자리는 두 갈래로 갈린다:
 *
 *  - 갈래 탭으로 시작하는 지면(콘텐츠 · 글로벌 · 바이럴)은 탭 알약 줄의
 *    오른쪽 끝, 헤어라인이 끝나는 자리에 앉는다.
 *  - 대제목 블록으로 시작하는 지면(IMC · 퍼포먼스)은 본문 맨 위에 자기
 *    줄을 하나 갖고 오른쪽으로 붙는다(app/service/[slug]/page.tsx).
 *
 * 규격은 이 사이트의 밝은 지면 CTA 그대로다 — 채운 남색 알약에 흰 글자
 * (키워드 알약 · 이커머스 요금제의 상담 문의 버튼과 한 벌). 흰 바탕에서
 * 유일하게 색으로 채워진 덩어리라 글자만 있는 주변에서 먼저 눈에 든다.
 *
 * 좁은 화면에서는 라벨을 'WORK' 한 단어로 줄인다 — 탭 줄에 같이 설 때
 * 버튼이 길면 그만큼 알약 쪽이 눌린다.
 */
export default function WorkLink({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/work"
      className={`group inline-flex shrink-0 items-center gap-2 rounded-full bg-abyss px-5 py-2.5 font-display text-sm font-bold tracking-tight whitespace-nowrap text-white transition-colors hover:bg-mid sm:px-6 sm:py-3 ${className}`}
    >
      <span className="sm:hidden">WORK</span>
      <span className="hidden sm:inline">WORK 보러가기</span>
      <span
        aria-hidden
        className="transition-transform group-hover:translate-x-0.5"
      >
        →
      </span>
    </Link>
  );
}
