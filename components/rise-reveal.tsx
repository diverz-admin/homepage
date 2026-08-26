"use client";

import { useLayoutEffect, useRef, useState } from "react";

/**
 * 위 콘텐츠는 그 자리에 붙어 있고, 아래 패널이 화면 밑에서 솟아올라 그 위를
 * 덮는다. (hwacheon.com/ko/media/news 히어로 → 소식 목록 전환 참고.)
 *
 * sticky 트릭 + ResizeObserver로 잰 pinned의 실제 키.
 *
 *   [ pinned, 그 아래 pinned와 같은 키의 빈 스페이서 — 둘 다 같은 상자 안 ]
 *   [ panel, 위로 그 키만큼 끌어올림(margin-top: -높이) ]
 *
 * pinned은 그 상자 안에서 sticky로 화면 위쪽에 붙는다. 스페이서가 상자를
 * pinned 키만큼 더 늘여 둬서, pinned은 그 여유만큼 화면에 붙어 있을 수
 * 있다 — 크롬은 이 여유를 padding-bottom으로 주면 무시하고(sticky가 붙을
 * 자리로 쳐주지 않는다), 형제 엘리먼트의 키로 줘야 잡는다.
 *
 * "덮이는 구간 길이"를 고정값(예: 56svh)으로 못 박았더니, pinned이 그보다
 * 길면(제목+설명+키워드+문의하기가 그래픽보다 긴 상품) sticky 구간이 끝나
 * 버린 뒤에도 pinned 아랫단(키워드 알약 줄 등)이 panel에 덜 덮인 채로
 * 남았다 — 스크롤이 끝나도 그 자리에 그대로 박혀 어색하게 잘려 보였다.
 * pinned의 실측 높이를 그대로 덮이는 구간으로 쓰면, panel이 sticky 구간이
 * 끝나는 바로 그 지점에서 pinned을 정확히 다 덮어 그런 틈이 남지 않는다.
 *
 * rAF나 스크롤 리스너 없이 브라우저 네이티브 sticky만으로 동작해 버벅임이
 * 없다.
 */
export default function RiseReveal({
  pinned,
  panel,
  panelClassName = "",
}: {
  pinned: React.ReactNode;
  panel: React.ReactNode;
  panelClassName?: string;
}) {
  const pinnedRef = useRef<HTMLDivElement>(null);
  const [overlap, setOverlap] = useState(0);

  useLayoutEffect(() => {
    const el = pinnedRef.current;
    if (!el) return;

    const measure = () => setOverlap(el.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative">
      <div className="relative">
        {/* top-32 — 고정 헤더(h-20=80px) 아래로 여유를 둔다. 페이지의 다른
            스크롤 오프셋(scroll-mt-32, KeepSectionInView의 OFFSET=128)과 같다. */}
        <div ref={pinnedRef} className="sticky top-32">
          {pinned}
        </div>
        {/* padding-bottom 대신 형제 스페이서 — 위 주석 참고. */}
        <div aria-hidden style={{ height: overlap }} />
      </div>

      <div
        /* flow-root — panel의 자식(GlobalMarketingTabs 등)이 위쪽 여백
           (mt-20 등)을 갖고 있으면, 그 여백이 panel의 위쪽 마진과
           합쳐져(마진 상쇄) 여기 준 음수 마진의 일부를 갉아먹는다.
           그러면 panel이 pinned을 다 덮기 전에 sticky 구간이 끝나 버려
           아랫단(키워드 알약 등)이 살짝 덜 덮인 채로 남는다. flow-root로
           새 블록 서식 맥락을 만들어 자식 마진이 밖으로 새지 않게 막는다.

           bleed-x — 배경을 화면 끝까지 물린다. page-container 폭 그대로
           두면 배경색이 페이지와 같아도 그림자가 좌우 여백 안에서 상자
           테두리처럼 보인다. overflow-x-clip — bleed-x가 100vw 기준이라
           스크롤바 폭만큼 넘칠 수 있어 잘라 준다(panel은 sticky의 조상이
           아니라 pinned에는 영향이 없다). 안쪽은 다시 page-container로
           감싸 글자 폭은 그대로 유지한다. */
        className={`relative z-10 flow-root bleed-x overflow-x-clip bg-background shadow-[0_-40px_80px_-40px_rgb(10_21_38/0.35)] ${panelClassName}`}
        style={{ marginTop: -overlap }}
      >
        <div className="page-container">{panel}</div>
      </div>
    </div>
  );
}
