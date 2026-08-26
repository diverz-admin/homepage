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
 * ecommerce-structure-v3.png)의 남색 카드에서 픽셀을 그대로 떠 왔다 —
 * 좌상단 #2d3d6a → 우하단 #101b3d. 그림과 지면이 같은 남색을 쓰면 카드와
 * 표가 개념도의 연장으로 읽힌다.
 */
export const SOLUTION_BG =
  "bg-[linear-gradient(135deg,#2d3d6a_0%,#101b3d_100%)]";
