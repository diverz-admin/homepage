import { SITE_URL } from "@/lib/seo";

// 빌드할 때 한 번 만들어 정적 파일처럼 내보낸다.
export const dynamic = "force-static";

/**
 * robots.txt. Next의 robots.ts(MetadataRoute.Robots)는 주석 줄을 넣을 수 없는데,
 * Daum 웹마스터도구가 소유 확인 문자열을 robots.txt 주석으로 요구해서 직접 쓴다.
 */
const body = `#DaumWebMasterTool:ecc2e6c8f8f292aa7303c39e3a98b9944500f79fe47b3273f1163f28bfdc0488:/Dn1va1+69DmjyIIIsTgww==

User-Agent: *
Allow: /
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`;

export function GET() {
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
