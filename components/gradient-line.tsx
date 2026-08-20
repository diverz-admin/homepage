/**
 * 제목을 한 줄씩 끊어 주는 래퍼.
 *
 * 이름 그대로 원래는 줄마다 그라디언트를 입혔는데(흰색→액센트), 디자인
 * 시스템을 "정갈한" 톤으로 옮기면서 글자 그라디언트를 전부 걷어냈다.
 * 색이 흐르는 큰 글씨는 이 톤과 정면으로 어긋나서, 지금은 부모의 글자색을
 * 그대로 물려받는 평범한 한 줄로만 렌더한다.
 *
 * 컴포넌트를 없애지 않은 이유는 두 가지다.
 *  - 제목을 줄 단위로 끊는 역할(block)은 그대로 필요하다.
 *  - 14개 파일이 이걸 쓰고 있어서, 여기만 바꾸면 한 번에 정리된다.
 */
export default function GradientLine({
  children,
}: {
  children: React.ReactNode;
  /**
   * @deprecated 더 이상 쓰이지 않는다. 글자색은 부모에서 정한다.
   * 호출부 14곳을 한꺼번에 고치지 않으려고 타입만 남겨 뒀다.
   */
  gradient?: string;
}) {
  return <span className="block">{children}</span>;
}
