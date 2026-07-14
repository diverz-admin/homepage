"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

const fieldClass =
  "w-full rounded-lg border border-black/10 bg-white/60 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-white/5";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        setErrorMessage(payload.error ?? "전송에 실패했습니다.");
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
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-medium">이름 *</span>
          <input name="name" required maxLength={80} className={fieldClass} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium">이메일 *</span>
          <input
            name="email"
            type="email"
            required
            maxLength={160}
            className={fieldClass}
          />
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-medium">회사명</span>
        <input name="company" maxLength={120} className={fieldClass} />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-medium">문의 내용 *</span>
        <textarea
          name="message"
          required
          rows={5}
          maxLength={4000}
          className={`${fieldClass} resize-y`}
        />
      </label>

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
      >
        {status === "sending" ? "전송 중…" : "문의 보내기"}
      </button>

      {status === "sent" && (
        <p className="text-sm text-emerald-600 dark:text-emerald-400">
          문의가 정상적으로 접수되었습니다. 빠르게 회신드리겠습니다.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
      )}
    </form>
  );
}
