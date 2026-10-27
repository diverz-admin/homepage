import type { Metadata } from "next";
import { company } from "@/lib/site";

export const SITE_URL = "https://diverz.kr";
export const SITE_NAME = "DIVERZ";
export const DEFAULT_TITLE = "DIVERZ — DIVE DEEP, RISE FAST";
export const OG_IMAGE = "/images/hero-deep.png";

/**
 * 외부 서비스에서 발급받는 값. 비어 있으면 해당 태그/스크립트를 출력하지 않는다.
 * - GA_MEASUREMENT_ID: GA4 측정 ID (G-XXXXXXXXXX)
 * - GOOGLE_SITE_VERIFICATION: Google Search Console HTML 태그의 content 값
 * - NAVER_SITE_VERIFICATION: 네이버 서치어드바이저 HTML 태그의 content 값
 */
export const GA_MEASUREMENT_ID: string = "";
export const GOOGLE_SITE_VERIFICATION: string = "bwY6Q_PNn29G4zm6agnD6Gx3N8VWV4ojBM4Hqbix88A";
export const NAVER_SITE_VERIFICATION: string = "1de5bc42333993b63f05c6f82b1c2d7828a43b17";

/** intro/positioning의 "\n" 줄바꿈과 "**강조**" 마커는 메타 문구에서 걷어낸다. */
export function plain(text: string) {
  return text.replace(/\n/g, " ").replace(/\*\*/g, "");
}

export const SITE_DESCRIPTION = `${plain(company.positioning)} ${plain(company.intro)}`;

export const KEYWORDS = [
  "다이버즈",
  "DIVERZ",
  "마케팅 대행사",
  "IMC 마케팅",
  "퍼포먼스 마케팅",
  "바이럴 마케팅",
  "글로벌 마케팅",
  "광고 대행사",
  "콘텐츠 제작",
  "블루에그",
];

/** <link rel="alternate" type="application/rss+xml"> — 네이버가 RSS를 찾는 자리. */
export const RSS_ALTERNATE = {
  "application/rss+xml": [{ url: "/rss.xml", title: SITE_NAME }],
};

/**
 * 페이지별 메타데이터. openGraph/twitter는 layout 값과 깊게 합쳐지지 않고
 * 통째로 덮이므로, 이미지 등 공통 값을 여기서 매번 함께 채운다.
 */
export function pageMetadata({
  path,
  title,
  description,
}: {
  path: string;
  title: string;
  description: string;
}): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: path, types: RSS_ALTERNATE },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      siteName: SITE_NAME,
      url: path,
      title: fullTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE],
    },
  };
}
