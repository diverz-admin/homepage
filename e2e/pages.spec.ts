import { expect, test } from "@playwright/test";
import { services } from "../lib/site";

const pages = [
  { path: "/", title: "다이버즈 DIVERZ — DIVE DEEP, RISE FAST" },
  { path: "/who-we-are", title: /WHO WE ARE/ },
  { path: "/service", title: /SERVICE/ },
  ...services.map((service) => ({
    path: `/service/${service.slug}`,
    title: new RegExp(service.name),
  })),
  { path: "/work", title: /WORK/ },
  { path: "/recruiting", title: /RECRUITING/ },
  { path: "/contact", title: /CONTACT/ },
];

for (const page_ of pages) {
  test(`${page_.path} 가 렌더된다`, async ({ page }) => {
    const response = await page.goto(page_.path);

    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(page_.title);
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
  });
}

test("헤더 네비게이션으로 각 페이지를 이동할 수 있다", async ({ page }) => {
  await page.goto("/");

  const header = page.getByRole("banner");
  // 메뉴 항목은 MENU 버튼을 눌러야 펼쳐진다.
  await header.getByRole("button", { name: /MENU/ }).click();
  await page.getByRole("link", { name: /WORK/ }).first().click();
  await expect(page).toHaveURL(/\/work$/);

  await header.getByRole("link", { name: "CONTACT", exact: true }).click();
  await expect(page).toHaveURL(/\/contact$/);
});

test("실제 회사 정보가 푸터에 노출된다", async ({ page }) => {
  await page.goto("/");

  const footer = page.getByRole("contentinfo");
  await expect(footer).toContainText("주식회사 다이버즈");
  await expect(footer).toContainText("info@diverz.kr");
  await expect(footer).toContainText("경기도 고양시 일산동구");
});

test("아임웹 템플릿의 HR 더미 문구가 남아있지 않다", async ({ page }) => {
  await page.goto("/");
  const body = await page.locator("body").innerText();

  // 원본 diverz.kr 에 잘못 노출되던 템플릿 잔재. 재발하면 바로 잡는다.
  expect(body).not.toContain("HR 플랫폼");
  expect(body).not.toContain("workflow");
  expect(body).not.toContain("근태");
});
