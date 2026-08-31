"use client";

import { ArrowRight, ChevronDown } from "lucide-react";

import { recruit } from "@/lib/site";

/**
 * 채용 지원 폼.
 *
 * 생김새는 문의 폼(components/contact-form.tsx)을 따른다 — 어두운 바탕에
 * 밑줄만 있는 입력, 왼쪽 라벨 / 오른쪽 입력의 두 칸 줄, 액센트색 알약 버튼.
 * 한 사이트에 폼이 둘인데 서로 다른 모양이면 그 자체로 만든 사람이 둘로
 * 보인다.
 *
 * 다만 보내는 방식은 다르다. 문의 폼은 /api/contact 로 저장하지만, 이쪽은
 * 적은 값을 지원 메일 본문에 채워 메일 앱을 연다. 이유는 두 가지다.
 *
 *  1) 지원은 처음부터 메일로 받기로 한 자리다. 폼이 따로 어딘가에 쌓이면
 *     "메일로 보내라"는 안내와 실제 접수 창구가 둘로 갈려, 한쪽이 조용히
 *     새는 자리가 생긴다.
 *  2) 이력서/포트폴리오는 결국 첨부로 와야 하는데 폼에는 파일을 받을 자리가
 *     없다. 메일 앱이 열리면 그 자리에서 붙일 수 있다.
 *
 * 그래서 개인정보 수집 동의 체크박스도 두지 않는다 — 우리가 받아 두는 값이
 * 없다. 실제로 서버에 쌓기로 하면 그때 동의 절차가 같이 와야 한다.
 */

/** 밑줄만 있는 입력 — 문의 폼과 같은 라인 스타일. */
const field =
  "w-full border-b border-white/15 bg-transparent py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-accent";

/** 라벨 + 입력을 한 줄로 놓는 그리드. 좁은 화면에서는 위아래로 쌓는다. */
const row = "grid gap-2 sm:grid-cols-[88px_1fr] sm:items-center sm:gap-6";

const label = "text-sm font-bold text-white";

export default function RecruitApplyForm() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const get = (key: string) => String(data.get(key) ?? "").trim();

    const position = get("position");
    const subject = position
      ? `[${recruit.subjectPrefix}] ${position}`
      : `[${recruit.subjectPrefix}]`;

    /* 빈 칸은 본문에서 통째로 뺀다 — "이메일:"만 덩그러니 남으면 받는 쪽에서
       안 적은 건지 지워진 건지 알 수 없다. */
    const body = [
      ["성함", get("name")],
      ["연락처", get("phone")],
      ["이메일", get("email")],
      ["희망 직무", position],
    ]
      .filter(([, value]) => value)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");

    const tail = "\n\n이력서와 포트폴리오를 첨부해 보내주세요.\n";
    window.location.href = `mailto:${recruit.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(`${body}${tail}`)}`;
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8">
      <label className={row}>
        <span className={label}>성함 *</span>
        <input
          name="name"
          required
          maxLength={80}
          placeholder="성함을 입력해주세요."
          autoComplete="name"
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
          autoComplete="tel"
          className={field}
        />
      </label>

      <label className={row}>
        <span className={label}>이메일 *</span>
        <input
          name="email"
          type="email"
          required
          maxLength={160}
          placeholder="회신받을 이메일을 입력해주세요."
          autoComplete="email"
          className={field}
        />
      </label>

      <label className={row}>
        <span className={label}>희망 직무 *</span>
        {/* 네이티브 select의 기본 화살표를 지우고 우리 아이콘을 얹는다.
            [&>option] — 펼친 목록은 OS가 그리므로 어두운 배경을 따로 준다. */}
        <span className="relative block">
          {/* 직무 목록은 모집 직군(lib/site.ts)을 그대로 쓴다 — 여기 따로
              적어 두면 공고가 바뀔 때 한쪽만 남는다. */}
          <select
            name="position"
            required
            defaultValue=""
            className={`${field} appearance-none pr-8 [&>option]:bg-abyss [&>option]:text-white`}
          >
            <option value="" disabled>
              지원하실 직무를 선택해주세요
            </option>
            {recruit.positions.map((position) => (
              <option key={position.id} value={position.name}>
                {position.name} ({position.role})
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-0 h-4 w-4 -translate-y-1/2 text-white/40"
          />
        </span>
      </label>

      <button
        type="submit"
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-8 py-4 text-sm font-bold text-abyss transition hover:bg-accent-soft"
      >
        지원 메일 작성하기
        <ArrowRight
          aria-hidden
          className="h-4 w-4 transition group-hover:translate-x-1"
        />
      </button>

      <p className="text-xs leading-relaxed text-white/45">
        버튼을 누르면 적으신 내용이 채워진 지원 메일이 열립니다. 이력서와
        포트폴리오는 그 메일에 첨부해 보내주세요.
      </p>
    </form>
  );
}
