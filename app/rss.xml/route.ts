import { services } from "@/lib/site";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";

// 빌드할 때 한 번 만들어 정적 파일처럼 내보낸다.
export const dynamic = "force-static";

/** 네이버 서치어드바이저에 제출하는 RSS. 블로그가 없어 주요 지면을 항목으로 싣는다. */
const pages = [
  { path: "/who-we-are", title: "WHO WE ARE", description: "다이버즈는 브랜드의 본질을 탐색하고 성장을 함께 만들어내는 IMC 마케팅 파트너입니다." },
  ...services.map((service) => ({
    path: `/service/${service.slug}`,
    title: service.name,
    description: service.summary,
  })),
  { path: "/work", title: "WORK", description: "다이버즈가 함께한 브랜드와 프로젝트 기록입니다." },
  { path: "/recruiting", title: "RECRUITING", description: "다이버즈와 함께 성장할 인재를 모집합니다." },
  { path: "/contact", title: "CONTACT", description: "다이버즈에 프로젝트를 문의하세요." },
];

function escape(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function GET() {
  const items = pages
    .map(
      (page) => `    <item>
      <title>${escape(page.title)}</title>
      <link>${SITE_URL}${page.path}</link>
      <guid>${SITE_URL}${page.path}</guid>
      <description>${escape(page.description)}</description>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>${escape(SITE_DESCRIPTION)}</description>
    <language>ko</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
