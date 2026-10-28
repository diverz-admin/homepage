import { SITE_URL } from "@/lib/seo";

// 빌드할 때 한 번 만들어 정적 파일처럼 내보낸다.
export const dynamic = "force-static";

/**
 * robots.txt. Next의 robots.ts(MetadataRoute.Robots)는 주석 줄을 넣을 수 없는데,
 * Daum 웹마스터도구가 소유 확인 문자열을 robots.txt 주석으로 요구해서 직접 쓴다.
 */
const body = `#DaumWebMasterTool:ffa7e8088fcf8dd751c1020dabab978903c086716ec1756730ae8a4043ba1156:7v7Co2KibzUex4fH7zWmNA==

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
