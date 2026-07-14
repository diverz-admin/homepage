import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  message?: unknown;
};

function asTrimmedString(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const name = asTrimmedString(body.name, 80);
  const email = asTrimmedString(body.email, 160);
  const company = asTrimmedString(body.company, 120);
  const message = asTrimmedString(body.message, 4000);

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "이름, 이메일, 문의 내용은 필수입니다." },
      { status: 400 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "이메일 형식이 올바르지 않습니다." },
      { status: 400 }
    );
  }

  try {
    const supabase = createServerSupabase();
    const { error } = await supabase
      .from("contacts")
      .insert({ name, email, company: company || null, message });

    if (error) {
      console.error("[contact] insert failed:", error.message);
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

  return NextResponse.json({ ok: true }, { status: 201 });
}
