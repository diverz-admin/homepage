"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

type Status = "idle" | "sending" | "sent" | "error";

/** 홈페이지 문의 폼(components/contact-form.tsx)과 같은 밑줄 입력. */
const field =
  "w-full border-b border-white/15 bg-transparent py-3 text-base text-white outline-none transition placeholder:text-white/30 focus:border-accent sm:text-sm";

const label = "text-sm font-bold text-white";

/** 유입 기록에 남길 UTM 키. 메타 광고 링크에 붙어 오는 것들이다. */
const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

/**
 * 광고 랜딩 전용 간편 신청 폼.
 *
 * 홈페이지 문의 폼보다 칸을 줄였다 — 광고로 들어온 사람은 망설이는 칸이
 * 하나 늘 때마다 빠져나간다. 문의유형은 랜딩이 이미 정하고 있어서 묻지
 * 않고 고정값(inquiryType)으로 보낸다.
 *
 * 같은 /api/contact 로 보내되, 어느 랜딩에서 어떤 광고로 왔는지(경로 +
 * UTM)를 source 로 붙인다. 문의 메일과 DB 에 "유입" 으로 남는다.
 */
export default function LandingForm({ inquiryType }: { inquiryType: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  /** 스팸 방지: 폼이 처음 그려진 시각. 서버가 너무 빨리 온 제출을 거른다
   *  (app/api/contact/route.ts MIN_FILL_MS). */
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // 제출하는 순간의 주소에서 읽는다 — 서버 렌더 때는 검색 파라미터를
    // 쓰지 않아 지면을 정적으로 둘 수 있다.
    const params = new URLSearchParams(window.location.search);
    const utm = UTM_KEYS.filter((key) => params.get(key))
      .map((key) => `${key}=${params.get(key)}`)
      .join("&");
    const source = utm
      ? `${window.location.pathname}?${utm}`
      : window.location.pathname;

    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: data.get("company"),
          name: data.get("name"),
          phone: data.get("phone"),
          storeUrl: data.get("storeUrl"),
          inquiryTypes: [inquiryType],
          consent: data.get("consent") === "on",
          source,
          website: data.get("website"),
          elapsedMs: Date.now() - startedAt.current,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        setErrorMessage(payload.error ?? "전송에 실패했습니다.");
        setStatus("error");
        return;
      }

      // 메타 픽셀 전환 이벤트 — 문의 접수가 성공했을 때만 보낸다.
      window.fbq?.("track", "Lead");

      form.reset();
      setStatus("sent");
    } catch {
      setErrorMessage("네트워크 오류가 발생했습니다.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-accent/30 bg-accent/5 px-6 py-10 text-center sm:px-10">
        <p className="font-display text-fluid-xl font-bold text-white">
          신청이 접수되었습니다.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-white/70">
          전담 매니저가 확인 후 남겨 주신 연락처로 연락드리겠습니다.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-7">
      {/* 스팸 방지 함정 칸. 사람에게는 보이지 않고 Tab으로도 닿지 않는다. */}
      <div
        aria-hidden
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <label>
          Website
          <input
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </label>
      </div>
      <label className="grid gap-1">
        <span className={label}>업체명/스토어명 *</span>
        <input
          name="company"
          required
          maxLength={120}
          placeholder="스토어 이름을 입력해주세요."
          className={field}
        />
      </label>

      <div className="grid gap-7 sm:grid-cols-2 sm:gap-6">
        <label className="grid gap-1">
          <span className={label}>성함 *</span>
          <input
            name="name"
            required
            maxLength={80}
            autoComplete="name"
            placeholder="성함을 입력해주세요."
            className={field}
          />
        </label>

        <label className="grid gap-1">
          <span className={label}>연락처 *</span>
          <input
            name="phone"
            type="tel"
            required
            maxLength={40}
            autoComplete="tel"
            inputMode="tel"
            placeholder="010-0000-0000"
            className={field}
          />
        </label>
      </div>

      <label className="grid gap-1">
        <span className={label}>진단받을 상품/스토어 주소</span>
        <input
          name="storeUrl"
          type="text"
          maxLength={300}
          inputMode="url"
          placeholder="smartstore.naver.com/... (선택)"
          className={field}
        />
      </label>

      <label className="flex cursor-pointer items-start gap-2.5 text-sm leading-relaxed text-white/70">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 h-4 w-4 shrink-0 accent-accent"
        />
        <span>
          상담을 위한 개인정보(업체명, 성함, 연락처) 수집 및 이용에 동의합니다.
          *
        </span>
      </label>

      <button
        type="submit"
        disabled={status === "sending"}
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-8 py-4 text-base font-bold text-abyss transition hover:bg-accent-soft disabled:opacity-60"
      >
        {status === "sending" ? "신청 중…" : "무료 순위 진단 신청하기"}
        <ArrowRight
          aria-hidden
          className="h-4 w-4 transition group-hover:translate-x-1"
        />
      </button>

      {status === "error" && (
        <p className="text-sm font-medium text-red-400">{errorMessage}</p>
      )}
    </form>
  );
}
