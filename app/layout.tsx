import type { Metadata } from "next";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import Cursor from "@/components/cursor";
import { company } from "@/lib/site";
// 한글 본문 폰트 Pretendard (유니코드 dynamic-subset — 필요한 글리프만 로드)
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://diverz.kr"),
  title: {
    default: "DIVERZ — DIVE DEEP, RISE FAST",
    template: "%s | DIVERZ",
  },
  description: `${company.positioning} ${company.intro.replace(/\n/g, " ")}`,
  openGraph: {
    title: "DIVERZ — DIVE DEEP, RISE FAST",
    description: company.positioning,
    type: "website",
    locale: "ko_KR",
    images: ["/images/hero-deep.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className="h-full antialiased"
    >
      <body className="flex min-h-full flex-col">
        <Cursor />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
