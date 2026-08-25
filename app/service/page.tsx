import { redirect } from "next/navigation";

import { services } from "@/lib/site";

/**
 * /service 는 첫 상품으로 넘긴다.
 *
 * 예전에는 5종을 이어 붙인 원페이지였고, 그 다음에는 목차 한 장이었다.
 * 목차는 상세 페이지 위쪽 메뉴에 이미 5종이 다 있어서 한 번 더 고르게 만드는 화면이었고,
 * 그래서 첫 상품(IMC 마케팅)을 바로 편다. 메뉴의 SERVICE 링크는 이 경로를
 * 그대로 쓰므로, 상품 순서를 바꾸면 첫 화면도 따라 바뀐다.
 */
export default function ServicePage() {
  redirect(`/service/${services[0].slug}`);
}
