"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

/** 문의유형 — 다이버즈 실제 서비스 라인업을 두 갈래로 묶었다. */
const INQUIRY_TYPES = [
  "IMC · 퍼포먼스 · 바이럴 · 글로벌 마케팅",
  "콘텐츠 제작 (숏폼·영상·광고 소재·카피)",
];

const BUDGET_OPTIONS = [
  "500만원 미만",
  "500만원 ~ 1,000만원",
  "1,000만원 ~ 3,000만원",
  "3,000만원 이상",
  "아직 정해지지 않음",
];

/** 밑줄 스타일 텍스트 입력. 배경 없이 아래 선만 있어 라벨-값 행처럼 보인다. */
const fieldClass =
  "w-full bg-transparent py-1 text-sm text-white outline-none placeholder:text-white/30";

/** 라벨 | 입력값 한 행. 아래쪽 구분선과 세로 여백을 공통으로 준다. */
function FormRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[5rem_1fr] items-start gap-x-6 border-b border-white/12 py-5 sm:grid-cols-[6rem_1fr]">
      <span className="pt-1.5 text-sm font-bold text-white">{label}</span>
      <div>{children}</div>
    </div>
  );
}

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name"),
      company: formData.get("company"),
      phone: formData.get("phone"),
      budget: formData.get("budget"),
      inquiryTypes: formData.getAll("inquiryTypes"),
      consent: formData.get("consent") === "on",
    };

    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setErrorMessage(data.error ?? "전송에 실패했습니다.");
        setStatus("error");
        return;
      }

      form.reset();
      setStatus("sent");
    } catch {
      setErrorMessage("네트워크 오류가 발생했습니다.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormRow label="문의유형">
        <div className="flex flex-col gap-3">
          {INQUIRY_TYPES.map((type) => (
            <label
              key={type}
              className="flex items-center gap-3 text-sm text-white/70"
            >
              <input
                type="checkbox"
                name="inquiryTypes"
                value={type}
                className="size-4 shrink-0 accent-accent"
              />
              {type}
            </label>
          ))}
        </div>
      </FormRow>

      <FormRow label="업체명">
        <input
          name="company"
          maxLength={120}
          placeholder="업체명을 입력해주세요."
          className={fieldClass}
        />
      </FormRow>

      <FormRow label="성함">
        <input
          name="name"
          required
          maxLength={80}
          placeholder="성함을 입력해주세요."
          className={fieldClass}
        />
      </FormRow>

      <FormRow label="연락처">
        <input
          name="phone"
          type="tel"
          required
          maxLength={40}
          placeholder="연락처를 입력해주세요."
          className={fieldClass}
        />
      </FormRow>

      <FormRow label="예산">
        {/* 네이티브 select에 밑줄 스타일을 입히고, 화살표는 직접 그린다
            (브라우저 기본 화살표는 지울 수 없어 appearance-none으로 끈다). */}
        <div className="relative">
          <select
            name="budget"
            defaultValue=""
            className="w-full appearance-none bg-transparent py-1 pr-8 text-sm text-white outline-none [&_option]:text-abyss"
          >
            <option value="" disabled className="text-white/30">
              마케팅 월 집행 예산을 선택해주세요
            </option>
            {BUDGET_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            className="pointer-events-none absolute top-1/2 right-0 size-4 -translate-y-1/2 text-white/40"
          >
            <path
              d="M5 7.5 10 12.5 15 7.5"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </FormRow>

      <div className="flex items-center justify-between pt-6">
        <label className="flex items-center gap-3 text-sm text-white/70">
          <input
            type="checkbox"
            name="consent"
            required
            className="size-4 shrink-0 accent-accent"
          />
          개인정보 수집에 동의합니다.
        </label>
        {/* TODO: 개인정보처리방침 페이지가 생기면 실제 링크로 바꾼다. */}
        <span className="text-xs text-white/40 underline underline-offset-2">
          자세히보기
        </span>
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-accent py-4 text-sm font-bold text-abyss transition hover:bg-accent-soft disabled:opacity-60"
      >
        {status === "sending" ? "전송 중…" : "간편 문의하기"}
        <span aria-hidden>→</span>
      </button>

      {status === "sent" && (
        <p className="mt-4 text-sm font-medium text-accent-soft">
          문의가 정상적으로 접수되었습니다. 빠르게 회신드리겠습니다.
        </p>
      )}
      {status === "error" && (
        <p className="mt-4 text-sm font-medium text-red-400">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
