/**
 * 지면에서 되풀이해 쓰는 바탕 한 벌.
 *
 * 클래스 문자열이라 lib/site.ts(내용)나 lib/utils.ts(도우미) 어느 쪽도
 * 제자리가 아니라 따로 둔다. 값을 여기 한 번만 적는 게 요점이다 —
 * 같은 남색을 쓰는 자리가 이미 넷(중국 이커머스 탭의 NEEDS 카드 · COMPARISON
 * 표 · PLAN 추천 카드, 병원 탭의 유입 시스템)이라, 각자 적어 두면 한쪽만
 * 고쳐질 자리가 된다.
 *
 * (Tailwind는 소스 텍스트를 훑어 클래스를 찾으므로 상수에 담아도 그대로
 * 생성된다.)
 */

/**
 * 다이버즈 쪽을 나타내는 남색 그라디언트.
 *
 * 색은 글로벌 마케팅 개념도(public/images/service/global/
 * ecommerce-structure-v3.png)의 남색 카드에서 픽셀을 그대로 떠 왔었다 —
 * 좌상단 #2d3d6a → 우하단 #101b3d. 그림과 지면이 같은 남색을 쓰면 카드와
 * 표가 개념도의 연장으로 읽힌다는 이유였다.
 *
 * 지금은 거기서 한 단 밝힌 값이다(#3a4c80 → #1c2b55, L* 로 +6 안팎).
 * 짙은 쪽 끝(#101b3d)이 거의 검정에 닿아 있어서, 이 바탕이 화면 폭을 다
 * 쓰는 띠로 커진 뒤로는 지면이 그 자리에서 뚝 끊겨 보였다. 카드 한 장일
 * 때는 문제가 아니었지만 띠는 면적이 다르다.
 *
 * 그래서 개념도의 남색과는 이제 정확히 같지 않다. 다시 맞춰야 할 일이
 * 생기면 그림 쪽을 새로 받아 값을 여기 한 번만 고친다.
 */
export const SOLUTION_BG =
  "bg-[linear-gradient(135deg,#3a4c80_0%,#1c2b55_100%)]";

/**
 * PROCESS 띠의 바탕 — 화면 끝까지 덮는 어두운 판.
 *
 * 색 정지점이 셋이라 Tailwind 임의값으로 적으면 한 줄이 읽히지 않아
 * 인라인 style(backgroundImage)로 넘긴다. 값은 수심 스케일(globals.css)의
 * deep(#17253c)과 abyss를 잇는 중간색들이다.
 *
 * 콘텐츠 지면의 제작 공정(components/contents-production.tsx)과 퍼포먼스
 * 지면의 성과 곡선(components/performance-funnel.tsx)이 같이 쓴다 —
 * 두 지면의 PROCESS 묶음은 같은 판 위에 서야 한 벌로 읽힌다.
 */
export const PROCESS_BAND_BG =
  "radial-gradient(130% 100% at 78% 0%, #1e3352 0%, #16273f 42%, rgb(10 21 38) 100%)";
