import Image from "next/image";
import {
  BadgeCheck,
  LayoutGrid,
  Repeat2,
  Users,
  type LucideIcon,
} from "lucide-react";

import Reveal from "@/components/reveal";
import { Badge } from "@/components/ui/badge";
import { imcWhyDiverz } from "@/lib/site";

/** reason.title로 찾는 아이콘 · 배경 사진. 데이터(lib/site.ts)는 직렬화
 * 가능한 값만 두므로, 컴포넌트를 그리는 아이콘/이미지는 여기 둔다.
 * 인덱스가 아니라 제목으로 매칭한다 — imcWhyDiverz.reasons의 순서를
 * 바꿔도(카드 위치를 서로 바꾸는 등) 아이콘·사진이 따라가야 하기 때문이다.
 * 사진은 "Service page/IMC Marketing/image 33~36.png" 원본을 각 이유의
 * 내용에 맞춰 골라 옮겼다(public/images/imc/why-diverz) — 올인원 조직→
 * 여러 채널 무드보드를 함께 보는 팀, 다양한 업종 경험→여러 브랜드 자료를
 * 혼자 다루는 모습, 높은 재계약률→계약서 앞의 악수, 검증된 실행력→
 * 데이터를 보며 논의하는 팀. */
const REASON_META: Record<string, { icon: LucideIcon; image: string }> = {
  "올인원 조직": {
    icon: Users,
    image: "/images/imc/why-diverz/allinone-photo.png",
  },
  "다양한 업종 경험": {
    icon: LayoutGrid,
    image: "/images/imc/why-diverz/industries-photo.png",
  },
  "높은 재계약률": {
    icon: Repeat2,
    image: "/images/imc/why-diverz/renewal-photo.png",
  },
  "검증된 실행력": {
    icon: BadgeCheck,
    image: "/images/imc/why-diverz/execution-photo.png",
  },
};

/**
 * WHY DIVERZ — shadcn "Feature section with bento grid" 레시피를 이 페이지
 * 톤에 맞춰 옮겼다.
 *
 * 원본은 bg-muted(rounded-md) 카드를 쓰지만, 이 프로젝트는 --muted를
 * "옅게 깔리는 텍스트 색"(rgb(abyss/0.55))으로 쓰고 있어 그대로 배경에
 * 채우면 카드가 아니라 회색 얼룩으로 보인다. 대신 카드 전체를 무드 이미지로
 * 채우고 아래쪽에 그라디언트 스크림을 얹어 글자를 얹는다 — 이 사이트의
 * 라이트 카드 문법(border-line + bg-surface)보다 벤토 그리드의 사진 카드
 * 느낌에 더 맞는다. 이미지가 이미 어두운 네이비라 카드 안에서만 글자색이
 * .on-light 흐름과 반대로 흰색이다(다른 카드형 블록 — hospital-marketing의
 * bg-abyss 다크 카드 — 도 같은 이유로 자체 색을 쓴다).
 *
 * 배지 색도 마찬가지 이유로 shadcn 기본(bg-primary — 이 프로젝트엔 없는
 * 토큰)이 아니라 이 페이지의 키워드 알약과 같은 bg-abyss/text-white를
 * className으로 얹는다.
 *
 * 이유 4가지는 strengths(회사 강점 데이터)에서 그대로 끌어온 imcWhyDiverz —
 * 새로 지어내지 않아 다른 페이지의 숫자와 어긋나지 않는다.
 */
function Feature() {
  return (
    /* .section-gap(112/152/176px) 대신 직접 잡는다 — 바로 위 IMC 본문은
       오른쪽 개념도가 왼쪽 글보다 훨씬 길어서, 그리드 행이 그림 높이에
       맞춰지며 왼쪽 아래에 이미 빈 칸이 한참 남는다. 그 빈 칸이 사실상
       여백 노릇을 하므로 여기서는 최소한만 준다 — 지면 기본 리듬은 물론
       그 절반(64/80/96px)도 개념도 아래로 한 번 더 벌어져 두 묶음이
       끊어져 보였다.
       globals.css 가 레이어 밖이라 .section-gap 을 같이 쓰면 mt-* 가 지므로
       클래스를 아예 빼야 한다. */
    <div className="mt-8 w-full sm:mt-10 xl:mt-12">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col items-start gap-4">
          <Reveal>
            <Badge className="border-transparent bg-abyss text-white hover:bg-abyss/90">
              WHY DIVERZ
            </Badge>
          </Reveal>
          <Reveal delay={60}>
            <div className="flex flex-col gap-2">
              <h2 className="text-left font-display text-fluid-2xl font-bold tracking-tight text-foreground">
                다이버즈를 선택해야 하는 이유
              </h2>
              <p className="max-w-xl text-left text-fluid-base leading-relaxed tracking-tight text-foreground/60">
                채널을 넘나드는 실행 데이터와 성과로 증명해 온 4가지입니다.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {imcWhyDiverz.reasons.map((reason, i) => {
            const { icon: Icon, image } = REASON_META[reason.title];
            const isLarge = i === 0 || i === 3;
            return (
              <Reveal
                key={reason.title}
                delay={100 + i * 70}
                className={isLarge ? "lg:col-span-2" : ""}
              >
                {/* 작은 카드가 제 폭 기준 비율(5:4 — 정사각형보다 살짝
                    납작하게)로 이 페이지에서 행의 높이를 정한다. 큰 카드는
                    lg부터 이 비율을 풀고 h-full로 그 행 높이에 맞춰
                    늘어난다 — 자기 폭(작은 칸의 두 배) 기준으로 비율을
                    유지하면 행이 지나치게 높아지고, 짝 지어진 작은 카드
                    아래에는 빈 공간만 남는다. lg 미만(2단)에서는 큰 카드도
                    폭이 작은 카드와 같아져 같은 비율이 자연스럽다. */}
                <div
                  className={`group relative flex aspect-[5/4] w-full flex-col justify-between overflow-hidden ${
                    isLarge ? "h-full lg:aspect-auto" : ""
                  }`}
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* 아래쪽만 어둡게 — 글자 대비를 확보하되 이미지 위쪽은 그대로 보인다. */}
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-abyss/95 via-abyss/25 to-transparent"
                  />

                  <div className="relative z-10 flex h-full flex-col justify-between p-6">
                    <span className="flex size-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/25 backdrop-blur-sm">
                      <Icon className="size-5 stroke-[1.5] text-white" />
                    </span>
                    <div className="flex flex-col">
                      <h3 className="text-xl tracking-tight text-white">
                        {reason.title}
                      </h3>
                      <p className="max-w-xs text-base break-keep text-white/70">
                        {reason.body}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { Feature };
