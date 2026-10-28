import { createClient } from "@supabase/supabase-js";

/** 테스트에서 DB 저장 결과를 직접 확인/정리하기 위한 클라이언트. */
export function testSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "E2E 실행에 Supabase 환경변수가 필요합니다. .env.local 을 확인하세요."
    );
  }

  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

/** 테스트가 만든 문의만 지운다. */
export async function deleteContactsByPhone(phone: string) {
  const { error } = await testSupabase().from("contacts").delete().eq("phone", phone);
  if (error) throw new Error(`테스트 데이터 정리 실패: ${error.message}`);
}
