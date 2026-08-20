/**
 * 푸터 하단 — 파도가 수면처럼 부풀어 오르는 이펙트.
 *
 * 겹의 원리(globals.css의 .wave-swell/.wave-drift 주석 참고):
 *  - 바깥(.wave-swell)이 위아래로 느리게 오르내려 "차오른다"는 인상을 준다.
 *  - 안쪽(.wave-drift)이 그 안에서 가로로 끊김 없이 흐른다.
 * 뒤/앞 두 겹을 속도·색·크기 다르게 겹쳐 파도에 깊이감을 낸다.
 *
 * 각 겹의 SVG는 같은 물결 모양을 가로로 두 번 이어 붙인 뒤(너비 200%)
 * 정확히 절반만큼 밀어 반복시킨다 — 이어지는 자리가 안 보인다.
 */
const WAVE_PATH =
  "M0,40 C120,10 240,70 360,40 C480,10 600,70 720,40 " +
  "L720,120 L0,120 Z";

function WaveLayer({
  color,
  height,
  swellDuration,
  driftDuration,
  opacity,
}: {
  color: string;
  height: number;
  swellDuration: number;
  driftDuration: number;
  opacity: number;
}) {
  return (
    <div
      className="wave-swell absolute inset-x-0 bottom-0"
      style={{ height, animationDuration: `${swellDuration}s` }}
    >
      <svg
        className="wave-drift absolute bottom-0 left-0 h-full"
        style={{ animationDuration: `${driftDuration}s` }}
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        fill={color}
        fillOpacity={opacity}
      >
        <path d={WAVE_PATH} />
        <path d={WAVE_PATH} transform="translate(720, 0)" />
      </svg>
    </div>
  );
}

export default function RisingWave() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <WaveLayer
        color="var(--ocean-mid)"
        height={64}
        swellDuration={9}
        driftDuration={16}
        opacity={0.22}
      />
      <WaveLayer
        color="var(--accent-soft)"
        height={44}
        swellDuration={7}
        driftDuration={11}
        opacity={0.3}
      />
    </div>
  );
}
