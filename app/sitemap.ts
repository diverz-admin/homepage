import type { MetadataRoute } from "next";
import { services } from "@/lib/site";

const BASE = "https://diverz.kr";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/who-we-are",
    ...services.map((service) => `/service/${service.slug}`),
    "/work",
    "/recruiting",
    "/contact",
  ];
  return paths.map((path) => ({ url: `${BASE}${path}` }));
}
