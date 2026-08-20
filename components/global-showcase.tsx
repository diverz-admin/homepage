import Image from "next/image";

/**
 * 글로벌 마케팅 블록 오른쪽에 놓는 실 사례 이미지.
 * 샤오홍슈(중국) 라이브커머스 화면 합성 — 아마존·샤오홍슈 등 해외
 * 플랫폼 노출이라는 서비스 내용을 한 장으로 보여준다.
 * 원본은 정사각(1254x1254)이라 그대로 살린다.
 */
export default function GlobalShowcase() {
  return (
    <div className="w-[clamp(16rem,22vw,24rem)] overflow-hidden rounded-2xl shadow-[0_8px_40px_rgb(6_13_28/0.35)] ring-1 ring-white/10">
      <Image
        src="/images/global/china.png"
        alt="샤오홍슈 라이브커머스에 노출된 DIVERZ 브랜드"
        width={1254}
        height={1254}
        sizes="(min-width: 1280px) 24rem, 0px"
        className="h-full w-full object-cover"
      />
    </div>
  );
}
