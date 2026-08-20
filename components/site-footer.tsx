import Link from "next/link";
import { Download } from "lucide-react";
import Bubbles from "@/components/bubbles";
import { company, companyProfile, nav } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-abyss">
      {/* 다른 다크 섹션(히어로·CTA)과 같은 기포 모티프를 푸터에도 얹는다. */}
      <Bubbles />
      <div className="page-container relative py-20">
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

          <dl className="grid content-start gap-10 text-sm">
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

        <div className="mt-16 border-t border-line pt-8 text-xs">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-white/60">
            <span>대표자 : {company.ceo}</span>
            <span aria-hidden className="text-white/20">
              |
            </span>
            <span>사업자등록번호 : {company.bizNumber}</span>
          </p>
          <p className="mt-3 text-white/30">
            Copyright © {new Date().getFullYear()} {company.name}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
