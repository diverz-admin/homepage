"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

type Status = "idle" | "sending" | "sent" | "error";

/** 칸 하나 — 둥근 상자. 선택지 줄과 같은 모양이다. */
const box =
  "w-full rounded-lg border border-line bg-white/[0.04] px-4 py-3.5 text-base text-white outline-none transition placeholder:text-white/30 focus:border-accent sm:text-sm";

/** 질문 제목 + 필수 표시(작은 동그라미 안 별표). */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1.5 text-base font-bold text-white">
      {children}
      <span
        aria-hidden
        className="flex h-4 w-4 items-center justify-center rounded-full bg-white/10 text-[0.65rem] leading-none text-white/80"
      >
        *
      </span>
    </span>
  );
}

const LETTERS = "ABCDEFGH";

/** 한 줄짜리 선택지 묶음 — 줄마다 A/B/C 글자 배지. 고르면 강조색 테두리. */
function Choices({
  name,
  legend,
  options,
}: {
  name: string;
  legend: string;
  options: readonly string[];
}) {
  return (
    <fieldset className="grid gap-2.5">
      <legend className="mb-3">
        <Label>{legend}</Label>
      </legend>
      {options.map((option, i) => (
        <label
          key={option}
          className="flex cursor-pointer items-center gap-3 rounded-lg border border-line bg-white/[0.04] px-4 py-3.5 text-sm text-white/85 transition hover:border-white/25 has-[:checked]:border-accent has-[:checked]:bg-accent/10 has-[:checked]:text-white has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent/50"
        >
          <input
            type="radio"
            name={name}
            value={option}
            required
            className="peer sr-only"
          />
          <span
            aria-hidden
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white/15 text-[0.65rem] font-bold text-white/80 transition peer-checked:bg-accent peer-checked:text-abyss"
          >
            {LETTERS[i]}
          </span>
          {option}
        </label>
      ))}
    </fieldset>
  );
}

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
 * 받은 레퍼런스와 같은 구성: 휴대폰 번호 → 판매 플랫폼 → 트래픽 광고
 * 경험 → 월 예상 광고비(모두 한 줄 선택지) → 개인정보처리방침 전문보기
 * → 동의. 성함/업체명은 묻지 않는다 — 광고로 들어온 사람은 망설이는 칸이
 * 하나 늘 때마다 빠져나간다. 판매 플랫폼/광고 경험은 contacts.message 에,
 * 광고비는 budget 에 담긴다(app/api/contact/route.ts). 문의유형은 랜딩이 이미 정하고 있어서 묻지
 * 않고 고정값(inquiryType)으로 보낸다.
 *
 * 같은 /api/contact 로 보내되, 어느 랜딩에서 어떤 광고로 왔는지(경로 +
 * UTM)를 source 로 붙인다. 문의 메일과 DB 에 "유입" 으로 남는다.
 */
export default function LandingForm({
  inquiryType,
  platforms,
  adExperience,
  budgets,
}: {
  inquiryType: string;
  platforms: readonly string[];
  adExperience: readonly string[];
  budgets: readonly string[];
}) {
  const [policyOpen, setPolicyOpen] = useState(false);
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
          phone: data.get("phone"),
          platform: data.get("platform"),
          adExperience: data.get("adExperience"),
          budget: data.get("budget"),
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
      // track 이라 이 페이지에 뜬 픽셀 모두(사이트 공통 + 랜딩 전용)에 간다.
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
    <form onSubmit={handleSubmit} className="grid gap-9">
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
      <label className="grid gap-3">
        <Label>휴대폰 번호</Label>
        <input
          name="phone"
          type="tel"
          required
          maxLength={40}
          autoComplete="tel"
          inputMode="numeric"
          placeholder="'-'를 제외한 휴대폰 번호를 입력해주세요"
          className={box}
        />
      </label>

      <Choices
        name="platform"
        legend="상품 판매중인 플랫폼"
        options={platforms}
      />
      <Choices
        name="adExperience"
        legend="트래픽 광고 경험"
        options={adExperience}
      />
      <Choices name="budget" legend="월 예상 광고비" options={budgets} />

      <div className="grid gap-4">
        <p className="text-sm text-white/70">
          개인정보처리방침{" "}
          <button
            type="button"
            onClick={() => setPolicyOpen((open) => !open)}
            aria-expanded={policyOpen}
            className="font-bold text-accent underline underline-offset-4"
          >
            {policyOpen ? "접기" : "전문보기"}
          </button>
        </p>
        {policyOpen && (
          <div className="rounded-lg border border-line bg-white/[0.03] px-4 py-4 text-xs leading-relaxed text-white/60">
            <p className="font-bold text-white/80">
              개인정보 수집 및 이용 안내
            </p>
            <dl className="mt-2 grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-1.5">
              <dt className="text-white/45">수집 항목</dt>
              <dd>
                휴대폰 번호, 판매 플랫폼, 트래픽 광고 경험, 월 예상 광고비
              </dd>
              <dt className="text-white/45">이용 목적</dt>
              <dd>무료 순위 진단 및 상담 연락</dd>
              <dt className="text-white/45">보유 기간</dt>
              <dd>상담 종료 후 1년, 또는 동의 철회 시 즉시 파기</dd>
            </dl>
            <p className="mt-2">
              동의를 거부할 수 있으며, 거부 시 상담 신청이 제한됩니다.
            </p>
          </div>
        )}
        <label className="flex cursor-pointer items-center gap-3 text-sm text-white/80">
          <input
            type="checkbox"
            name="consent"
            required
            className="h-5 w-5 shrink-0 rounded accent-accent"
          />
          <span className="flex items-center gap-1.5">
            다이버즈 개인정보 수집 및 이용에 동의합니다
            <span
              aria-hidden
              className="flex h-4 w-4 items-center justify-center rounded-full bg-white/10 text-[0.65rem] leading-none text-white/80"
            >
              *
            </span>
          </span>
        </label>
      </div>

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
