import { Layout, Megaphone, ShoppingBag } from "lucide-react";

import Reveal from "@/components/reveal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * 글로벌 마케팅의 두 번째 상품 — 중국 이커머스 입점 마케팅.
 *
 * 구조만 잡아 둔 자리다. 실제 소개 문구·운영 구조·패키지는 자료를 받은 뒤
 * hospital-marketing.tsx와 같은 결로 채운다(components/global-marketing-tabs.tsx
 * 에서 두 상품을 탭으로 오간다).
 *
 * 아래 탭+박스는 hospital-marketing.tsx의 운영 구조 섹션과 같은 패턴이다.
 * 탭 이름과 박스 안 설명은 실제 운영 자료가 오기 전까지의 자리표시자이며,
 * 자료가 오면 placeholderItems를 hospitalMarketing.operation과 같은 형태의
 * 데이터로 옮기면 된다.
 */
const placeholderItems = [
  { icon: ShoppingBag, label: "계정·스토어 운영" },
  { icon: Layout, label: "콘텐츠 제작" },
  { icon: Megaphone, label: "유입·전환 관리" },
];

export default function EcommerceMarketing() {
  return (
    <section>
      <Reveal delay={40}>
        <p className="text-fluid-lg font-bold tracking-[-0.02em] break-keep text-accent">
          중국 이커머스 입점 마케팅
        </p>
      </Reveal>

      <Reveal delay={60}>
        <h3
          style={{ lineHeight: 1.15 }}
          className="mt-3 font-display text-fluid-2xl font-bold tracking-tight whitespace-pre-line break-keep text-foreground"
        >
          콘텐츠 준비 중입니다
        </h3>
      </Reveal>

      <Reveal delay={80}>
        <p className="mt-6 max-w-2xl text-fluid-lg leading-[1.85] font-normal tracking-[-0.04em] break-keep text-foreground/60">
          중국 이커머스 입점 마케팅 소개, 운영 구조, 패키지 구성이 이 자리에 들어갑니다.
        </p>
      </Reveal>

      <Reveal delay={100}>
        <Tabs defaultValue={placeholderItems[0].label} className="mt-12">
          <TabsList className="flex flex-wrap items-center justify-center gap-2">
            {placeholderItems.map((item) => (
              <TabsTrigger
                key={item.label}
                value={item.label}
                className="flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-[0.85rem] font-bold tracking-[-0.01em] text-foreground/60 data-[state=active]:border-accent/30 data-[state=active]:bg-accent/10 data-[state=active]:text-accent"
              >
                <item.icon strokeWidth={2} className="size-4" />
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-6 rounded-2xl border border-line bg-surface/60 p-8 sm:p-12">
            {placeholderItems.map((item) => (
              <TabsContent key={item.label} value={item.label}>
                <span className="flex size-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <item.icon strokeWidth={2} className="size-6" />
                </span>
                <p className="mt-6 text-[1.3rem] font-bold break-keep text-foreground">
                  {item.label}
                </p>
                <p className="mt-3 max-w-2xl text-[0.95rem] leading-[1.8] break-keep text-foreground/65">
                  콘텐츠 준비 중입니다.
                </p>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </Reveal>
    </section>
  );
}
