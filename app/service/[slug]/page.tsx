import { redirect } from "next/navigation";
import { services } from "@/lib/site";

/**
 * 서비스는 /service 원페이지로 합쳤다.
 * 예전 상세 경로(/service/imc 등)로 들어오면 해당 앵커로 넘긴다.
 * 링크가 이미 밖에 나가 있을 수 있어 404로 끊지 않는다.
 */
export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export default async function ServiceSlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const known = services.some((s) => s.slug === slug);
  redirect(known ? `/service#${slug}` : "/service");
}
