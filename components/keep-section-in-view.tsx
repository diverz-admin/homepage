"use client";

import { useEffect } from "react";

/**
 * 상품을 갈아탈 때 보던 자리를 지켜 준다. (/service/[slug])
 *
 * 왼쪽 메뉴는 scroll={false}라 스크롤 위치를 그대로 두는데, 그것만으로는
 * 부족했다. 상품마다 본문 길이가 크게 다르기 때문이다 — 바이럴은 3,549px,
 * 나머지는 1,800px 안팎이다. 바이럴을 한참 내려 보다가(2,594px) 콘텐츠로
 * 넘어가면 그 페이지의 최대 스크롤이 1,005px이라 브라우저가 거기까지 끌어
 * 올린다. 결과적으로 새 페이지의 맨 아래(푸터)에 떨어지고, 화면에서는
 * "위로 튀었다"로 보인다.
 *
 * 그래서 "브라우저가 실제로 끌어올렸을 때만" 손을 댄다.
 *
 *  - 새 페이지가 그 자리를 담을 수 있으면 아무것도 하지 않는다. 화면이
 *    그대로 서 있고 내용만 갈린다 — 이게 기본 동작이다.
 *  - 담지 못해 문서 맨 아래로 밀렸으면, 그때만 지금 고른 상품의 시작점으로
 *    올려 준다. 푸터에 떨어져 있는 것보다는 낫다.
 *
 * 끌려 내려간 걸 알아내는 방법은 "지금 문서의 맨 끝에 서 있는가"다. 전환
 * 직후 바닥에 정확히 붙어 있다면 브라우저가 거기까지 밀어 놓은 것이다.
 * (스크롤 위치를 전환 전후로 비교하는 방법도 있지만, 그 값은 브라우저가
 * 이미 고쳐 쓴 뒤라 믿을 수 없다.)
 */
export default function KeepSectionInView({ id }: { id: string }) {
  useEffect(() => {
    const el = document.getElementById(id);
    if (!el) return;

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

    /* 바닥에 붙어 있지 않다면 자리가 그대로 남아 있다는 뜻 — 건드리지 않는다.
       2px 는 소수점 반올림 여유다. */
    if (maxScroll <= 0 || window.scrollY < maxScroll - 2) return;

    /* 고정 헤더(h-20)와 섹션의 scroll-mt-32가 잡아 둔 여백. 이 값만큼
       위를 비워야 제목이 헤더 밑에 깔리지 않는다. */
    const OFFSET = 128;
    const top = el.getBoundingClientRect().top + window.scrollY - OFFSET;

    /* 이미 그 위에 있으면(배너를 보고 있거나 첫 진입) 그대로 둔다 —
       페이지를 열자마자 배너를 건너뛰고 내려가 버리면 그게 더 놀랍다. */
    if (window.scrollY <= top) return;

    window.scrollTo({
      top,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, [id]);

  return null;
}
