import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";
import { company, companyProfile, nav } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-abyss">
      {/* 푸터 바닥의 실사 파도.
      
          예전에는 SVG 물결(RisingWave)이 아래에서 오르내렸는데, 그림으로
          그린 파도라 사이트의 다른 실사 이미지들과 결이 갈렸다. 사진으로
          바꾸면서 이음새를 없애는 게 관건이라, 두 겹으로 처리한다.

           1) 사진은 아래쪽에만 깔고 object-bottom 으로 물마루를 바닥에 붙인다.
           2) 그 위에 네이비 그라디언트를 덮는다 — 맨 위는 배경색과 완전히
              같은 불투명, 아래로 갈수록 옅어져 파도가 서서히 드러난다.
              사진에 마스크를 거는 대신 이렇게 덮는 이유는, 마스크는 경계가
              투명해질 뿐이라 뒤 배경색과 미세하게 어긋나면 선이 보이기
              때문이다. 같은 색으로 덮으면 어긋날 값 자체가 없다.

          바닥까지 완전히 투명하게 두지는 않는다 — 저작권 줄이 그 위에
          얹히는데, 파도 흰 포말 위에서는 글자가 읽히지 않는다.

          모바일에서는 밴드를 45%로 낮춘다. 세로로 긴 한 단이라 70%로 두면
          포말이 Contact·다운로드 버튼까지 올라와 글자가 묻힌다. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] min-h-[240px] sm:h-[70%] sm:min-h-[260px]"
      >
        <Image
          src="/images/footer-wave.jpg"
          alt=""
          fill
          sizes="100vw"
          className="footer-wave object-cover object-[50%_32%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--ocean-abyss)_0%,rgb(var(--ocean-abyss-rgb)/0.86)_26%,rgb(var(--ocean-abyss-rgb)/0.58)_58%,rgb(var(--ocean-abyss-rgb)/0.66)_88%,rgb(var(--ocean-abyss-rgb)/0.78)_100%)]" />
      </div>

      <div className="page-container relative py-16">
        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-[1fr_1fr_auto]">
          {/* 워드마크 아래로 메뉴가 크게 흐르는 구성 */}
          <div>
            <p className="font-display text-2xl font-black italic tracking-tight text-white">
              DIVERZ
            </p>
            <nav aria-label="푸터" className="mt-8">
              <ul className="grid gap-2.5">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="font-display text-xl font-semibold tracking-tight text-white/35 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="grid content-start gap-10 text-sm">
            <dl className="grid content-start gap-10">
              <div>
                <dt className="font-bold text-white">Address</dt>
                <dd className="mt-3 text-muted">{company.address}</dd>
              </div>
              <div>
                <dt className="font-bold text-white">Contact</dt>
                <dd className="mt-3">
                  <a
                    href={`mailto:${company.email}`}
                    className="text-muted transition-colors hover:text-accent"
                  >
                    E. {company.email}
                  </a>
                </dd>
              </div>
            </dl>

            {/* 사업자 정보 · 저작권. 예전에는 푸터 맨 아래 가로 바로 따로
                떨어져 있었는데, 주소·연락처와 같은 성격의 정보라 한 단으로
                모은다. 가로 바가 없어지면서 푸터 높이도 그만큼 줄었다. */}
            <div className="text-xs">
              <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-white/60">
                <span>대표자 : {company.ceo}</span>
                <span aria-hidden className="text-white/20">
                  |
                </span>
                <span>프로덕션 : {company.production}</span>
                <span aria-hidden className="text-white/20">
                  |
                </span>
                <span>사업자등록번호 : {company.bizNumber}</span>
              </p>
              <p className="mt-3 text-white/45">
                Copyright © {new Date().getFullYear()} {company.name}. All
                rights reserved.
              </p>
            </div>
          </div>

          <div>
            {/* 파일 자체는 public/files/ 에 넣는다. 경로는 lib/site.ts 에서 관리. */}
            <a
              href={companyProfile.path}
              download={companyProfile.filename}
              className="group inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-xs font-bold tracking-wide text-white transition hover:border-accent hover:bg-accent hover:text-abyss"
            >
              <Download
                aria-hidden
                className="h-4 w-4 transition group-hover:translate-y-0.5"
              />
              회사소개서 다운로드
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
