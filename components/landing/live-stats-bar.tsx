"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

type Stats = { views: number; inquiries: number };

/**
 * 내부 공유용 시연 숫자 — 주소에 ?demo=1 이 붙었을 때만 쓴다.
 *
 * 시안을 내부에서 돌려 볼 때 레퍼런스처럼 숫자가 찬 모습을 보이려는
 * 것이다. 실제 기록이 아니므로 일반 방문자(파라미터 없음)에게는 절대
 * 나가지 않는다 — 광고 링크에 demo 를 붙이지 않는다.
 *
 * 방문 1,800~3,600명, 문의는 그중 2~3% 안팎으로 뽑는다.
 */
function demoStats(): Stats {
  const views = 1800 + Math.floor(Math.random() * 1800);
  const inquiries = Math.round(views * (0.02 + Math.random() * 0.01));
  return { views, inquiries };
}

/**
 * 하단 고정 알림 바 — "오늘 N명이 보고 M명이 문의했어요!" + 신청 버튼.
 *
 * 숫자는 /api/landing-stats 가 세는 실제 기록이다. 불러오지 못하면
 * 숫자 줄을 숨기고 버튼만 남긴다. 예외는 내부 시연용 ?demo=1 하나다
 * (위 demoStats).
 *
 * 방문 기록은 브라우저 세션당 한 번만 보낸다(새로고침마다 늘지 않게).
 *
 * 데스크톱은 화면 아래 가운데 떠 있는 바, 모바일은 화면 폭을 다 쓰는
 * 하단 띠다. 모바일에서는 숫자 줄이 버튼 위로 올라간다.
 */
export default function LiveStatsBar({
  path,
  cta,
}: {
  path: string;
  cta: string;
}) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    // 시연 모드는 기록도 조회도 하지 않는다 — 실제 방문 수를 오염시키지 않게.
    if (new URLSearchParams(window.location.search).get("demo") === "1") {
      // 마운트 직후 한 번 정하는 값이라 렌더 중이 아니라 여기서 뽑는다.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStats(demoStats());
      return;
    }

    const key = `landing-view:${path}`;
    let seen = false;
    try {
      seen = sessionStorage.getItem(key) === "1";
      if (!seen) sessionStorage.setItem(key, "1");
    } catch {
      // 사생활 보호 모드 등에서 저장소가 막혀 있으면 그냥 한 번 기록한다.
    }

    const record = seen
      ? Promise.resolve()
      : fetch("/api/landing-stats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path }),
        }).catch(() => undefined);

    let cancelled = false;
    record
      .then(() => fetch(`/api/landing-stats?path=${encodeURIComponent(path)}`))
      .then((res) => (res.ok ? res.json() : null))
      .then((data: Stats | null) => {
        if (!cancelled && data && typeof data.views === "number") setStats(data);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [path]);

  const show = stats !== null && stats.views > 0;
  const fmt = (n: number) => n.toLocaleString("ko-KR");

  const message = show ? (
    <p className="flex items-center gap-2 text-sm font-medium text-white sm:text-base">
      <Bell aria-hidden className="h-4 w-4 shrink-0 text-accent" />
      <span>
        오늘 <b className="font-bold text-accent tabular-nums">{fmt(stats.views)}명</b>이
        보고
        {stats.inquiries > 0 && (
          <>
            {" "}
            <b className="font-bold text-accent tabular-nums">
              {fmt(stats.inquiries)}명
            </b>
            이 문의했어요!
          </>
        )}
        {stats.inquiries === 0 && " 있어요!"}
      </span>
    </p>
  ) : null;

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
        {message && <div className="mb-2.5 flex justify-center">{message}</div>}
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
