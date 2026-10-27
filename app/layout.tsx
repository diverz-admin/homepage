import type { Metadata } from "next";
import Script from "next/script";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import Cursor from "@/components/cursor";
import MetaPixelPageView from "@/components/meta-pixel-pageview";
import JsonLd from "@/components/json-ld";
import { company } from "@/lib/site";
import {
  DEFAULT_TITLE,
  GA_MEASUREMENT_ID,
  GOOGLE_SITE_VERIFICATION,
  KEYWORDS,
  NAVER_SITE_VERIFICATION,
  OG_IMAGE,
  RSS_ALTERNATE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  plain,
} from "@/lib/seo";
// 한글 본문 폰트 Pretendard (유니코드 dynamic-subset — 필요한 글리프만 로드)
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s | DIVERZ",
  },
  // intro의 "**강조**" 마커(components/ui/text-reveal.tsx가 강조색으로 읽는 표시)는
  // 메타 설명에는 필요 없는 표기라 걷어낸다(lib/seo.ts plain).
  description: SITE_DESCRIPTION,
  keywords: KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: company.name, url: SITE_URL }],
  creator: company.name,
  publisher: company.name,
  alternates: {
    canonical: "/",
    types: RSS_ALTERNATE,
  },
  openGraph: {
    title: DEFAULT_TITLE,
    description: plain(company.positioning),
    type: "website",
    locale: "ko_KR",
    siteName: SITE_NAME,
    url: "/",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: plain(company.positioning),
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // 각 값은 <meta name="..." content="..." /> 로 출력된다. 빈 값은 넣지 않는다.
  verification: {
    ...(GOOGLE_SITE_VERIFICATION && { google: GOOGLE_SITE_VERIFICATION }),
    other: {
      "facebook-domain-verification": "93gy94tiyzobxglb49oc8j49ozx6zc",
      ...(NAVER_SITE_VERIFICATION && {
        "naver-site-verification": NAVER_SITE_VERIFICATION,
      }),
    },
  },
};

/** 검색엔진에 회사/사이트 정보를 알리는 구조화 데이터(schema.org). */
const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: company.name,
  alternateName: [company.nameEn, "다이버즈"],
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  image: `${SITE_URL}${OG_IMAGE}`,
  description: SITE_DESCRIPTION,
  email: company.email,
  slogan: company.slogan.join(", "),
  founder: { "@type": "Person", name: company.ceo },
  taxID: company.bizNumber,
  address: {
    "@type": "PostalAddress",
    streetAddress: company.address,
    addressCountry: "KR",
  },
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  alternateName: "다이버즈",
  url: SITE_URL,
  inLanguage: "ko-KR",
  publisher: { "@id": `${SITE_URL}/#organization` },
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
        <JsonLd data={[organizationLd, websiteLd]} />
        {/* Google Analytics 4 — 측정 ID가 있을 때만 넣는다. 페이지 이동은
            GA4 향상된 측정(브라우저 기록 변경)이 PageView로 잡는다. */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
            </Script>
          </>
        )}
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
        <MetaPixelPageView />
        <Cursor />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
