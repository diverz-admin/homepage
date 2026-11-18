"use client";

import { useEffect } from "react";
import { Bell } from "lucide-react";

/**
 * 하단 고정 알림 바 — 안내 문구 + 신청 버튼.
 *
 * 처음엔 "오늘 N명이 보고 M명이 문의했어요" 실시간 숫자였으나, 숫자 대신
 * 고정 안내 문구로 바꿨다. 방문 기록(/api/landing-stats POST)은 나중에
 * 실제 숫자를 다시 쓸 수 있도록 계속 남긴다(브라우저 세션당 한 번).
 *
 * 데스크톱은 화면 아래 가운데 떠 있는 바, 모바일은 화면 폭을 다 쓰는
 * 하단 띠다. 모바일에서는 문구가 버튼 위로 올라간다.
 */
export default function LiveStatsBar({
  path,
  message: text,
  cta,
}: {
  path: string;
  message: string;
  cta: string;
}) {
  useEffect(() => {
    const key = `landing-view:${path}`;
    try {
      if (sessionStorage.getItem(key) === "1") return;
      sessionStorage.setItem(key, "1");
    } catch {
      // 사생활 보호 모드 등에서 저장소가 막혀 있으면 그냥 한 번 기록한다.
    }
    fetch("/api/landing-stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    }).catch(() => undefined);
  }, [path]);

  const message = (
    <p className="flex items-center gap-2 text-sm font-medium break-keep text-white sm:text-base">
      <Bell aria-hidden className="h-4 w-4 shrink-0 text-accent" />
      <span>{text}</span>
    </p>
  );

  return (
    <>
      {/* 데스크톱 — 가운데 떠 있는 바 */}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-30 hidden justify-center px-6 sm:flex">
        <div className="pointer-events-auto flex items-center gap-6 rounded-2xl border border-accent/40 bg-abyss/85 py-3 pr-3 pl-6 shadow-[0_10px_40px_rgb(0_0_0/0.45)] backdrop-blur">
          {message}
          <a
            href="#apply"
            className="shrink-0 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-abyss transition hover:bg-accent-soft"
          >
            {cta}
          </a>
        </div>
      </div>

      {/* 모바일 — 하단 띠. 페이지의 pb 가 이 높이만큼 바닥을 비워 둔다. */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-abyss/90 p-3 backdrop-blur sm:hidden">
        <div className="mb-2.5 flex justify-center text-center">{message}</div>
        <a
          href="#apply"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-4 text-base font-bold text-abyss"
        >
          {cta}
        </a>
      </div>
    </>
  );
}
