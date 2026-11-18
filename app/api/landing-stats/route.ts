import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";
import { landingStatsTargets } from "@/lib/landing";

/**
 * 광고 랜딩 알림 바의 숫자 — "오늘 N명이 보고 M명이 문의했어요".
 *
 *  POST { path }  방문 한 번을 기록한다(브라우저 세션당 한 번, 클라이언트가 막는다).
 *  GET ?path=...  오늘(한국 시간 0시부터) 방문 수와 문의 수를 돌려준다.
 *
 * 둘 다 실제 기록만 센다. 방문은 landing_views, 문의는 contacts 에서
 * 그 랜딩의 문의유형이 붙은 줄을 센다(supabase/schema.sql).
 */

/** 한국 시간 오늘 0시를 UTC ISO 문자열로. */
function startOfTodayKst(): string {
  const KST = 9 * 60 * 60 * 1000;
  const kstNow = new Date(Date.now() + KST);
  kstNow.setUTCHours(0, 0, 0, 0);
  return new Date(kstNow.getTime() - KST).toISOString();
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const path = typeof body?.path === "string" ? body.path : "";
  if (!(path in landingStatsTargets)) {
    return NextResponse.json({ error: "unknown path" }, { status: 400 });
  }

  try {
    const { error } = await createServerSupabase()
      .from("landing_views")
      .insert({ path });
    if (error) throw new Error(error.message);
  } catch (error) {
    console.error("[landing-stats] 방문 기록 실패:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function GET(request: Request) {
  const path = new URL(request.url).searchParams.get("path") ?? "";
  const inquiryType = landingStatsTargets[path];
  if (!inquiryType) {
    return NextResponse.json({ error: "unknown path" }, { status: 400 });
  }

  try {
    const supabase = createServerSupabase();
    const since = startOfTodayKst();

    const [views, inquiries] = await Promise.all([
      supabase
        .from("landing_views")
        .select("id", { count: "exact", head: true })
        .eq("path", path)
        .gte("created_at", since),
      supabase
        .from("contacts")
        .select("id", { count: "exact", head: true })
        .contains("inquiry_types", [inquiryType])
        .gte("created_at", since),
    ]);

    if (views.error || inquiries.error) {
      throw new Error(views.error?.message ?? inquiries.error?.message);
    }

    return NextResponse.json(
      { views: views.count ?? 0, inquiries: inquiries.count ?? 0 },
      // 방문자마다 DB 를 두 번 세지 않도록 CDN 에서 잠깐 묶어 둔다.
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
    );
  } catch (error) {
    console.error("[landing-stats] 집계 실패:", error);
    return NextResponse.json({ error: "stats unavailable" }, { status: 500 });
  }
}
