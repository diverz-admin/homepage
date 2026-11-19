/**
 * 문의를 구글 시트에 한 줄 추가한다.
 *
 * 시트에 붙인 Apps Script 웹 앱(scripts/google-sheet.gs)으로 보낸다.
 * GOOGLE_SHEET_WEBHOOK_URL 은 웹 앱 주소 끝에 `?key=비밀값` 을 붙인 값이다.
 * 값이 없으면 아무것도 하지 않는다(로컬 개발 등).
 *
 * 실패해도 문의는 이미 Supabase 에 저장돼 있으므로 예외를 던지지 않고
 * 로그만 남긴다.
 */
export type SheetRow = {
  name: string;
  company: string;
  phone: string;
  email: string;
  budget: string;
  inquiryTypes: string[];
  storeUrl: string;
  source: string;
  platform: string;
  adExperience: string;
};

export async function appendContactToSheet(row: SheetRow): Promise<void> {
  const url = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!url) return;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
      // Apps Script 는 응답을 다른 주소로 넘겨준다(302). 따라가야 결과를 읽는다.
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });
    const text = await response.text();
    if (!response.ok || !text.includes('"ok":true')) {
      console.error(
        `[contact] 구글 시트 기록 실패 (${response.status}):`,
        text.slice(0, 200),
      );
    }
  } catch (error) {
    console.error("[contact] 구글 시트 기록 중 예외:", error);
  }
}
