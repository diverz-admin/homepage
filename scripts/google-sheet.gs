/**
 * 다이버즈 문의 → 구글 시트 기록용 Apps Script.
 *
 * 쓰는 법: 구글 시트 > 확장 프로그램 > Apps Script 에 이 내용을 통째로
 * 붙여 넣고, 아래 KEY 를 아무도 모를 긴 값으로 바꾼 뒤 웹 앱으로 배포한다.
 * (서버의 lib/google-sheet.ts 가 이 웹 앱으로 문의를 보낸다.)
 */
const KEY = "여기에-아무도-모를-긴-비밀값";

const HEADERS = [
  "접수 시각",
  "상호명",
  "연락처",
  "판매 플랫폼",
  "트래픽 광고 경험",
  "월 예상 광고비",
  "스토어 주소",
  "유입 경로",
  "문의 유형",
  "성함",
  "이메일",
];

function doPost(e) {
  if (!e || !e.parameter || e.parameter.key !== KEY) {
    return json({ ok: false, error: "forbidden" });
  }

  const d = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }

  sheet.appendRow([
    Utilities.formatDate(new Date(), "Asia/Seoul", "yyyy-MM-dd HH:mm:ss"),
    d.company || "",
    // 0으로 시작하는 번호가 숫자로 바뀌지 않게 글자로 넣는다.
    "'" + (d.phone || ""),
    d.platform || "",
    d.adExperience || "",
    d.budget || "",
    d.storeUrl || "",
    d.source || "",
    (d.inquiryTypes || []).join(", "),
    d.name || "",
    d.email || "",
  ]);

  return json({ ok: true });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
