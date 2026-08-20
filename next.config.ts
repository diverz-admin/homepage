import type { NextConfig } from "next";

/**
 * STATIC_EXPORT=1 은 공유용 정적 HTML(out/)을 뽑을 때만 켠다.
 * 이 모드에서는 /api/contact 가 사라지므로(정적 export는 POST 라우트 미지원)
 * scripts/export-static.mjs 를 통해서만 실행한다.
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";

/**
 * 서비스 섹션·팀 카드의 임시 이미지가 Unsplash에서 온다.
 * next/image로 최적화하려면 호스트를 명시해야 한다.
 * 실제 이미지가 public/ 로 들어오면 이 설정은 지워도 된다.
 */
const remotePatterns = [
  { protocol: "https" as const, hostname: "images.unsplash.com" },
  { protocol: "https" as const, hostname: "plus.unsplash.com" },
];

const nextConfig: NextConfig = isStaticExport
  ? {
      output: "export",
      // /work -> /work/index.html 로 떨어져야 어떤 정적 서버에서도 그대로 열린다.
      trailingSlash: true,
      // 정적 export에는 이미지 최적화 서버가 없다.
      images: { unoptimized: true, remotePatterns },
    }
  : { images: { remotePatterns } };

export default nextConfig;
