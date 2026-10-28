"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { services } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "error";

const BUDGETS = [
  "월 300만원 미만",
  "월 300–500만원",
  "월 500–1,000만원",
  "월 1,000만원 이상",
  "아직 미정",
] as const;

/** 밑줄만 있는 입력 — 레퍼런스 폼의 라인 스타일. */
const field =
  "w-full border-b border-white/15 bg-transparent py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-accent";

/** 라벨 + 입력을 한 줄로 놓는 그리드. 좁은 화면에서는 위아래로 쌓는다. */
const row = "grid gap-2 sm:grid-cols-[88px_1fr] sm:items-center sm:gap-6";

const label = "text-sm font-bold text-white";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  /**
   * 문의유형은 "하나 이상" 골라야 한다. 체크박스 하나에 required를 걸면 그
   * 칸만 강제되므로, 아무것도 안 골랐을 때만 전부 required로 두고 하나라도
   * 고르면 푼다 — 브라우저 기본 검증을 그대로 쓰면서 그룹 필수를 만든다.
   */
  const [typePicked, setTypePicked] = useState(false);
  /** 스팸 방지: 폼이 처음 그려진 시각. 서버가 너무 빨리 온 제출을 거른다. */
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          company: data.get("company"),
          phone: data.get("phone"),
          email: data.get("email"),
          budget: data.get("budget"),
          inquiryTypes: data.getAll("inquiryTypes"),
          consent: data.get("consent") === "on",
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
      setTypePicked(false);
      setStatus("sent");
    } catch {
      setErrorMessage("네트워크 오류가 발생했습니다.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8">
      {/* 스팸 방지 함정 칸. 사람에게는 보이지 않고 Tab으로도 닿지 않는다.
          봇이 채우면 서버가 저장하지 않고 성공처럼 응답한다. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <div className="grid gap-2 sm:grid-cols-[88px_1fr] sm:gap-6">
        <span className={`${label} sm:pt-1`}>문의유형 *</span>
        {/* 6개를 flex-wrap으로 흘리면 폭에 따라 갈려 마지막 칸만 아래에 혼자
            남는다. 3열 격자로 못 박아 위 3 · 아래 3으로 떨어뜨린다.
            브랜딩은 services(lib/site.ts)에 없는 서비스라 별도로 붙인다. */}
        <div
          className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3"
          onChange={(event) =>
            setTypePicked(
              event.currentTarget.querySelectorAll(
                'input[name="inquiryTypes"]:checked'
              ).length > 0
            )
          }
        >
          {services.map((service) => (
            <label
              key={service.slug}
              className="flex cursor-pointer items-center gap-2 text-sm text-white/80 transition hover:text-white"
            >
              <input
                type="checkbox"
                name="inquiryTypes"
                value={service.name}
                required={!typePicked}
                className="h-4 w-4 accent-accent"
              />
              {service.name}
            </label>
          ))}
          <label className="flex cursor-pointer items-center gap-2 text-sm text-white/80 transition hover:text-white">
            <input
              type="checkbox"
              name="inquiryTypes"
              value="브랜딩"
              required={!typePicked}
              className="h-4 w-4 accent-accent"
            />
            브랜딩
          </label>
        </div>
      </div>

      <label className={row}>
        <span className={label}>업체명 *</span>
        <input
          name="company"
          required
          maxLength={120}
          placeholder="업체명을 입력해주세요."
          className={field}
        />
      </label>

      <label className={row}>
        <span className={label}>성함 *</span>
        <input
          name="name"
          required
          maxLength={80}
          placeholder="성함을 입력해주세요."
          className={field}
        />
      </label>

      <label className={row}>
        <span className={label}>연락처 *</span>
        <input
          name="phone"
          type="tel"
          required
          maxLength={40}
          placeholder="연락처를 입력해주세요."
          className={field}
        />
      </label>

      <label className={row}>
        <span className={label}>이메일</span>
        <input
          name="email"
          type="email"
          maxLength={160}
          placeholder="회신받을 이메일을 입력해주세요."
          className={field}
        />
      </label>

      <label className={row}>
        <span className={label}>예산</span>
        {/* 네이티브 select의 기본 화살표를 지우고 우리 아이콘을 얹는다. */}
        <span className="relative block">
          <select
            name="budget"
            defaultValue=""
            className={`${field} appearance-none pr-8 [&>option]:bg-abyss [&>option]:text-white`}
          >
            <option value="" disabled>
              마케팅 월 집행 예산을 선택해주세요
            </option>
            {BUDGETS.map((budget) => (
              <option key={budget} value={budget}>
                {budget}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden
            className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
          />
        </span>
      </label>

      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-white/80">
        <input
          type="checkbox"
          name="consent"
          required
          className="h-4 w-4 accent-accent"
        />
        개인정보 수집에 동의합니다.
      </label>

      <button
        type="submit"
        disabled={status === "sending"}
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-8 py-4 text-sm font-bold text-abyss transition hover:bg-accent-soft disabled:opacity-60"
      >
        {status === "sending" ? "전송 중…" : "간편 문의하기"}
        <ArrowRight
          aria-hidden
          className="h-4 w-4 transition group-hover:translate-x-1"
        />
      </button>

      {status === "sent" && (
        <p className="text-sm font-medium text-accent-soft">
          문의가 정상적으로 접수되었습니다. 빠르게 회신드리겠습니다.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm font-medium text-red-400">{errorMessage}</p>
      )}
    </form>
  );
}
