"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** 사이트 공통 메타 픽셀(app/layout.tsx). */
const SITE_PIXEL_ID = "1441874957911031";

/**
 * 클라이언트 라우팅으로 페이지를 옮길 때 메타 픽셀 PageView를 다시 보낸다.
 * 첫 진입의 PageView는 layout의 픽셀 코드가 이미 보내므로 건너뛴다.
 * 광고 랜딩 픽셀이 함께 떠 있어도 섞이지 않게 사이트 픽셀에만 보낸다.
 */
export default function MetaPixelPageView() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.fbq?.("trackSingle", SITE_PIXEL_ID, "PageView");
  }, [pathname]);

  return null;
}
