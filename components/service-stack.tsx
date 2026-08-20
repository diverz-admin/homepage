import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/reveal";
import { services } from "@/lib/site";

/**
 * 서비스 프리뷰 — 스크롤하면 다음 패널이 아래에서 올라와 앞 패널을 덮는다.
 *
 * 구현은 CSS sticky만으로 끝난다. 형제 패널을 전부 `sticky top-0`으로 두면
 *  - 각 패널이 화면 상단에 붙어 멈추고,
 *  - 뒤에 오는 패널이 DOM 순서상 위에 그려지므로 앞 패널을 덮는다.
 * 결과적으로 카드가 위로 쌓이듯 넘어간다. JS·스크롤 리스너가 필요 없다.
 *
 * 패널은 흐름에서 빠지지 않으므로(sticky) 섹션 높이는 자연히
 * 패널 수 × 100svh가 되고, 그만큼이 스크럽 구간이 된다.
 *
 * 각 패널에 불투명 배경이 반드시 있어야 앞 패널을 가린다 — 배경을 지우면
 * 두 패널이 겹쳐 보인다.
 */

/** 마침표+공백에서 문장을 나눈다. 모바일에서 문장 경계마다 줄을 바꾸는 데 쓴다. */
function splitSentences(text: string) {
  return text.split(/(?<=\.)\s+/).filter(Boolean);
}

export default function ServiceStack() {
  return (
    <section className="on-light relative bg-white">
      {/* 인트로 — sticky가 아니라 먼저 지나간다. */}
      <div className="page-container pt-32 pb-20 text-center sm:pt-44 sm:pb-28">
        <Reveal>
          <p className="font-display text-xs font-bold tracking-[0.35em] text-mid">
            SERVICE
          </p>
        </Reveal>
        <Reveal delay={100}>
          {/* max-w는 남기되 mx-auto로 가운데에 둔다 — 폭 제한만 있고
              가운데 정렬이 없으면 긴 화면에서 제목이 왼쪽에 붙는다. */}
          <h2 className="mx-auto mt-5 max-w-3xl text-balance break-keep font-display text-fluid-2xl font-bold tracking-tight text-abyss">
            {/* 모바일은 한 줄에 다 안 들어가 글자가 작게 눌린다 — 이 지점에서
                미리 끊어 두 줄로 읽히게 한다. sm 이상은 text-balance가 알아서
                균형 잡아주므로 그대로 한 줄로 둔다. */}
            브랜드에 필요한
            <br className="sm:hidden" /> 모든 실행을 다이버즈에서
          </h2>
        </Reveal>
      </div>

      {services.map((service) => (
        <article
          key={service.slug}
          /* 위쪽 경계선이 있어야 앞 패널을 덮으며 올라올 때 "새 장"이 시작되는
             게 읽힌다. 레퍼런스에서도 이 얇은 선이 층을 구분한다. */
          className="sticky top-0 h-[85svh] border-t border-abyss/10 bg-white"
        >
          <div className="page-container grid h-full grid-rows-[auto_1fr] gap-8 pt-20 pb-14 sm:pt-24 sm:pb-20 lg:grid-cols-2 lg:grid-rows-1 lg:items-stretch lg:gap-14">
            {/* 좌 — 제목·설명·CTA를 한 덩어리로 묶어 세로 가운데 정렬한다.
                예전엔 justify-between으로 제목은 위, 나머지는 아래로 벌려서
                사이에 큰 빈 공간이 생겼다. */}
            <div className="flex flex-col justify-center gap-6">
              {/* 제목이 이 패널의 포인트 색이다.
                  text-accent는 .on-light 안에서 흰 배경용 mid(#5b7897)로
                  자동 매핑되므로, 밝은 배경에서도 대비가 유지된다. */}
              <h3 className="font-display text-[clamp(1.9rem,4.4vw,3.4rem)] leading-[1.1] font-bold tracking-tight text-accent">
                {service.en}
              </h3>

              <div className="max-w-xl">
                {/* 제목이 색을 가져갔으므로 국문 라벨은 뒤로 물린다.
                    둘 다 색을 쓰면 위계가 사라진다. */}
                <p className="font-display text-sm font-bold tracking-[0.06em] text-abyss/45">
                  {service.name}
                </p>
                {/* 서비스마다 요약 길이가 제각각이라(IMC는 3문장) 줄 수를 묶는다.
                    전문은 /service에 있고 아래 CTA가 그쪽으로 보낸다.
                    모바일은 컬럼이 좁아 문장 중간(예: "매체를 운영하고" 뒤)에서
                    자연 개행이 걸려 어색하게 끊긴다 — 문장 경계마다 미리 끊는다.
                    sm 이상은 컬럼이 넓어 대부분 한 줄에 들어가므로 그대로 둔다. */}
                <p className="mt-4 line-clamp-4 text-pretty break-keep text-fluid-base leading-relaxed text-abyss/70 sm:line-clamp-3">
                  {splitSentences(service.summary).map((sentence, i, arr) => (
                    <span key={i}>
                      {sentence}
                      {/* sm 미만에서만 강제 개행하고, 그 위에서는 <br>이 사라지며
                          바로 뒤 공백이 문장 사이 띄어쓰기 역할을 한다. */}
                      {i < arr.length - 1 && <br className="sm:hidden" />}
                      {i < arr.length - 1 && " "}
                    </span>
                  ))}
                </p>
                <Link
                  href={`/service#${service.slug}`}
                  className="mt-8 inline-flex items-center gap-3 bg-abyss px-7 py-3.5 text-xs font-bold tracking-[0.1em] text-white transition hover:bg-deep"
                >
                  더 알아보기
                  <span aria-hidden>›</span>
                </Link>
              </div>
            </div>

            {/* 우 — 사진. 컬럼 높이를 그대로 채운다. */}
            <div className="relative min-h-0 overflow-hidden">
              <Image
                src={service.image}
                alt=""
                aria-hidden
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
