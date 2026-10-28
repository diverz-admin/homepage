import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";
import { sendContactNotification } from "@/lib/email";

type ContactPayload = {
  name?: unknown;
  company?: unknown;
  phone?: unknown;
  /** 선택 입력. 회신 수단은 연락처가 기본이고 이메일은 있으면 함께 받는다. */
  email?: unknown;
  inquiryTypes?: unknown;
  budget?: unknown;
  consent?: unknown;
  /** 스팸 방지 함정 칸(화면에 안 보임). 값이 있으면 봇이다. */
  website?: unknown;
  /** 폼이 그려진 뒤 제출까지 걸린 시간(ms). */
  elapsedMs?: unknown;
};

/** 사람이 필수 항목을 채우는 데 이보다 빨리 끝내기 어렵다. */
const MIN_FILL_MS = 3000;

function asTrimmedString(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function asStringArray(value: unknown, maxItems: number, maxLen: number): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .slice(0, maxItems)
    .map((item) => item.trim().slice(0, maxLen))
    .filter(Boolean);
}

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  /**
   * 봇으로 보이면 저장/메일 없이 성공처럼 응답한다. 실패를 돌려주면 봇이
   * 방식을 바꿔 다시 시도하기 때문이다.
   */
  const honeypot = asTrimmedString(body.website, 200);
  const elapsedMs = typeof body.elapsedMs === "number" ? body.elapsedMs : 0;
  if (honeypot || elapsedMs < MIN_FILL_MS) {
    console.warn(
      `[contact] spam blocked (honeypot=${Boolean(honeypot)}, elapsedMs=${elapsedMs})`
    );
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const name = asTrimmedString(body.name, 80);
  const company = asTrimmedString(body.company, 120);
  const phone = asTrimmedString(body.phone, 40);
  const email = asTrimmedString(body.email, 160);
  const budget = asTrimmedString(body.budget, 80);
  const inquiryTypes = asStringArray(body.inquiryTypes, 10, 120);
  const consent = body.consent === true;

  if (!name || !phone || !consent) {
    return NextResponse.json(
      { error: "성함, 연락처, 개인정보 수집 동의는 필수입니다." },
      { status: 400 }
    );
  }

  if (!/^[0-9+\-\s]{7,20}$/.test(phone)) {
    return NextResponse.json(
      { error: "연락처 형식이 올바르지 않습니다." },
      { status: 400 }
    );
  }

  // 이메일은 선택이라 비어 있으면 통과시키고, 적혀 있을 때만 형식을 본다.
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "이메일 형식이 올바르지 않습니다." },
      { status: 400 }
    );
  }

  try {
    const supabase = createServerSupabase();

    /**
     * Supabase가 간헐적으로 `JWT issued at future` 로 인증을 거부한다(우리 시계는 정상).
     * 인증 단계에서 막히는 것이라 행은 저장되지 않으므로 재시도해도 중복이 생기지 않는다.
     * 문의 유실은 비용이 크니 짧게 두 번 더 시도한다.
     */
    const ATTEMPTS = 3;
    let lastError: string | null = null;

    for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
      const { error } = await supabase.from("contacts").insert({
        name,
        phone,
        email: email || null,
        company: company || null,
        budget: budget || null,
        inquiry_types: inquiryTypes,
        consent,
      });

      if (!error) {
        lastError = null;
        break;
      }

      lastError = error.message;
      console.error(
        `[contact] insert failed (${attempt}/${ATTEMPTS}):`,
        error.message
      );

      if (attempt < ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 250));
      }
    }

    if (lastError) {
      return NextResponse.json(
        { error: "문의 저장에 실패했습니다. 잠시 후 다시 시도해 주세요." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[contact] unexpected error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }

  /**
   * 저장이 끝난 뒤에 알림 메일을 보낸다. 메일이 실패해도 문의는 이미 저장돼
   * 있으므로 사용자에게는 성공으로 응답한다 — 여기서 500을 내면 문의자가
   * 같은 내용을 또 보내 중복만 쌓인다. 대신 로그를 남겨 추적한다.
   */
  try {
    await sendContactNotification({
      name,
      company,
      phone,
      email,
      budget,
      inquiryTypes,
    });
  } catch (error) {
    console.error("[contact] 알림 메일 발송 중 예외:", error);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
