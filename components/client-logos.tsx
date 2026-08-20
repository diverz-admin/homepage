import Reveal from "@/components/reveal";
import { clientLogos } from "@/lib/site";
import GradientLine from "@/components/gradient-line";

/** 함께한 클라이언트 로고 월 — CLIENTS 바로 다음에 온다. */
export default function ClientLogos() {
  return (
    <section className="relative bg-white pb-32 pt-24 sm:pb-44 sm:pt-32">
      <div className="page-container">
        <Reveal>
          <p className="text-center font-display text-xs font-bold tracking-[0.35em] text-mid">
            PARTNERS
          </p>
        </Reveal>
        <Reveal delay={100}>
          {/* 흰 배경 섹션이라 글자색을 직접 준다. 예전에는 GradientLine이
              색까지 입혀 줬지만, 지금은 줄만 끊고 색은 부모를 따른다.
              여기는 .on-light 밖이라 기본 foreground가 밝은 색이어서
              색을 안 주면 흰 배경에 묻힌다. */}
          <h2 className="mt-5 text-center font-display text-fluid-2xl font-bold leading-tight tracking-tight text-abyss">
            <GradientLine>소상공인부터 기업까지</GradientLine>
            <GradientLine>다양한 업체가 다이버즈와 함께하고 있습니다</GradientLine>
          </h2>
        </Reveal>

        {/* 5열 × 5줄 = 25개만 노출한다(보유 로고는 26개).
            딱 떨어지는 격자라 grid를 쓴다 — 남는 칸이 없어 마지막 줄이
            왼쪽으로 쏠릴 일이 없다.

            아래쪽 페이드는 마지막 줄을 절반쯤에서 흐리게 지워 "더 많은
            고객사가 있다"는 인상을 준다. 5줄이면 마지막 줄이 80~100% 구간에
            오므로, 80%에서 시작해 97%에서 완전히 사라지게 잡았다. */}
        <ul
          /* 로고 월 자체의 최대 폭을 컨테이너보다 좁게 묶어 카드 가로를 줄인다.
             (1920 화면 기준 카드 약 325 → 260px). 컨테이너 폭을 그대로 쓰면
             5열이 화면 끝까지 퍼져 카드 하나가 너무 넓어진다. */
          className="mx-auto mt-16 grid max-w-[1360px] grid-cols-4 gap-2 sm:mt-20 sm:gap-4 lg:grid-cols-5"
          style={{
            maskImage:
              "linear-gradient(to bottom, #000 80%, rgb(0 0 0 / 0) 97%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, #000 80%, rgb(0 0 0 / 0) 97%)",
          }}
        >
          {clientLogos.slice(0, 25).map((logo, i) => (
            <Reveal
              as="li"
              key={logo.name}
              // 행 단위로 물결처럼 올라오게 — 열 수(5)로 나눠 같은 행끼리 묶는다.
              delay={160 + Math.floor(i / 5) * 90 + (i % 5) * 30}
              // 25개는 4열(모바일·태블릿)로 나누면 마지막 줄에 1개만 남아
              // 혼자 뜬다. lg(5열)에서는 5×5로 딱 맞으니 그때만 보여준다.
              className={i === 24 ? "hidden lg:block" : undefined}
            >
              {/* 카드 비율 16:7 → 16:6 (높이 14%↓). 로고 캔버스도 같은 16:6으로
                  다시 만들어서, 박스만 낮아지고 로고 크기는 그대로다. */}
              <div className="flex aspect-[16/6] items-center justify-center rounded-2xl bg-white shadow-[0_2px_14px_rgb(15_42_77/0.07)] ring-1 ring-slate-200/70">
                {logo.src ? (
                  /* 로고 원본 비율을 그대로 살려야 해서 next/image 대신 img를 쓴다.

                     원본 PNG를 카드와 같은 16:7 캔버스에 "잉크 면적이 같도록"
                     정규화해 두었다(투명 여백 제거 → 면적 기준 스케일 → 가운데
                     배치). 그래서 여기서는 캔버스를 카드에 그대로 채우기만 하면
                     되고, 여백도 이미지에 들어 있으므로 카드에 padding을 주지
                     않는다(주면 이중으로 들어가 로고가 작아진다). */
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logo.src}
                    alt={logo.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="h-[34%] w-[62%] rounded-md bg-slate-100"
                  />
                )}
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
