/**
 * 문의 알림 메일.
 *
 * 폼이 들어오면 Supabase에 저장하는 것과 별개로, 담당자 메일함으로도 한 통
 * 보낸다. 메일함을 1차 알림 채널로 쓰기 위한 것이라 발송이 실패해도 문의
 * 접수 자체는 성공으로 둔다(행은 이미 저장돼 있다) — 라우트에서 로그만 남긴다.
 *
 * 발송은 Resend(Vercel Marketplace 연동)를 쓴다. SDK 없이 REST 한 번이면
 * 끝나는 일이라 의존성을 더하지 않고 fetch로 직접 부른다.
 */

/** 받는 사람. 환경변수로 덮어쓸 수 있게 두되 기본값은 대표 메일. */
const TO = process.env.CONTACT_TO_EMAIL ?? "diverz1225@gmail.com";

/**
 * 보내는 사람. 도메인(diverz.kr) DNS 인증이 끝나기 전에는 Resend가 자체
 * 제공하는 onboarding@resend.dev 만 쓸 수 있고, 이 주소는 Resend 계정
 * 소유자 메일로만 배달된다. 인증을 마치면 CONTACT_FROM_EMAIL 에
 * "다이버즈 문의 <noreply@diverz.kr>" 같은 값을 넣으면 된다.
 */
const FROM = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";

export type ContactMail = {
  name: string;
  company: string;
  phone: string;
  email: string;
  budget: string;
  inquiryTypes: string[];
};

/** 메일 본문에 그대로 들어가므로 HTML 특수문자를 막아 둔다. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:10px 16px 10px 0;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top;">${label}</td>
    <td style="padding:10px 0;color:#111827;font-size:14px;">${escapeHtml(value) || "-"}</td>
  </tr>`;
}

/**
 * 알림 메일을 보낸다. 성공하면 true.
 * 키가 없으면(로컬 개발 등) 조용히 건너뛴다 — 문의 저장까지 막을 이유는 없다.
 */
export async function sendContactNotification(
  contact: ContactMail
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[contact] RESEND_API_KEY 없음 — 알림 메일을 건너뜁니다.");
    return false;
  }

  const subject = `[문의] ${contact.company || contact.name} — ${
    contact.inquiryTypes.join(", ") || "유형 미선택"
  }`;

  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo',sans-serif;max-width:560px;">
    <p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:.12em;color:#7c9cc4;">DIVERZ</p>
    <h2 style="margin:0 0 20px;font-size:19px;color:#111827;">새 문의가 접수되었습니다</h2>
    <table style="border-collapse:collapse;width:100%;">
      ${row("문의유형", contact.inquiryTypes.join(", "))}
      ${row("업체명", contact.company)}
      ${row("성함", contact.name)}
      ${row("연락처", contact.phone)}
      ${row("이메일", contact.email)}
      ${row("예산", contact.budget)}
    </table>
    <p style="margin:20px 0 0;font-size:12px;color:#9ca3af;">
      diverz.kr 문의 폼에서 자동 발송된 메일입니다.${
        contact.email ? " 이 메일에 그대로 답장하면 문의자에게 전달됩니다." : ""
      }
    </p>
  </div>`;

  const text = [
    "새 문의가 접수되었습니다.",
    "",
    `문의유형: ${contact.inquiryTypes.join(", ") || "-"}`,
    `업체명: ${contact.company || "-"}`,
    `성함: ${contact.name}`,
    `연락처: ${contact.phone}`,
    `이메일: ${contact.email || "-"}`,
    `예산: ${contact.budget || "-"}`,
  ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      subject,
      html,
      text,
      // 문의자가 이메일을 남겼으면 메일함에서 바로 답장할 수 있게 걸어 둔다.
      ...(contact.email ? { reply_to: contact.email } : {}),
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error(`[contact] 메일 발송 실패 (${response.status}):`, detail);
    return false;
  }

  return true;
}
