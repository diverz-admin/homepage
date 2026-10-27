"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * 클라이언트 라우팅으로 페이지를 옮길 때 메타 픽셀 PageView를 다시 보낸다.
 * 첫 진입의 PageView는 layout의 픽셀 코드가 이미 보내므로 건너뛴다.
 */
export default function MetaPixelPageView() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.fbq?.("track", "PageView");
  }, [pathname]);

  return null;
}
