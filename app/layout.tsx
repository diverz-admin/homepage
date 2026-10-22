import type { Metadata } from "next";
import Script from "next/script";
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
  // intro의 "**강조**" 마커(components/ui/text-reveal.tsx가 강조색으로 읽는 표시)는
  // 메타 설명에는 필요 없는 표기라 걷어낸다.
  description: `${company.positioning.replace(/\n/g, " ")} ${company.intro.replace(/\n/g, " ").replace(/\*\*/g, "")}`,
  openGraph: {
    title: "DIVERZ — DIVE DEEP, RISE FAST",
    description: company.positioning.replace(/\n/g, " "),
    type: "website",
    locale: "ko_KR",
    images: ["/images/hero-deep.png"],
  },
  // <meta name="facebook-domain-verification" content="..." /> 로 출력된다.
  verification: {
    other: {
      "facebook-domain-verification": "93gy94tiyzobxglb49oc8j49ozx6zc",
    },
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
        {/* Meta Pixel Code */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1441874957911031');
fbq('track', 'PageView');`}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1441874957911031&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
        <Cursor />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
