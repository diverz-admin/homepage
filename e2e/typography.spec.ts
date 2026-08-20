import { expect, test } from "@playwright/test";

const sizes = [
  { name: "모바일", width: 390, height: 844 },
  { name: "태블릿", width: 768, height: 1024 },
  { name: "데스크톱", width: 1440, height: 900 },
];

for (const size of sizes) {
  test(`${size.name}(${size.width}px)에서 타이포가 범위 안에 있고 가로 스크롤이 없다`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: size.width, height: size.height });
    await page.goto("/");

    const measured = await page.evaluate(() => {
      const size = (sel: string) => {
        const el = document.querySelector(sel);
        return el ? parseFloat(getComputedStyle(el).fontSize) : 0;
      };
      const doc = document.documentElement;
      return {
        h1: size("h1"),
        h2: size("h2"),
        p: size("main p"),
        overflow: doc.scrollWidth - doc.clientWidth,
      };
    });

    // clamp 범위: hero 3rem~8.5rem(48~136px), h2 2rem~3.5rem(32~56px), p 1rem~1.1rem(16~17.6px)
    expect(measured.h1).toBeGreaterThanOrEqual(48);
    expect(measured.h1).toBeLessThanOrEqual(136);
    expect(measured.h2).toBeGreaterThanOrEqual(32);
    expect(measured.h2).toBeLessThanOrEqual(56);
    expect(measured.p).toBeGreaterThanOrEqual(16);
    expect(measured.p).toBeLessThanOrEqual(17.6);

    // 유동 타이포가 넘쳐서 가로 스크롤을 만들면 안 된다.
    expect(measured.overflow).toBeLessThanOrEqual(0);
  });
}

test("뷰포트가 커지면 제목도 커진다", async ({ page }) => {
  const h1At = async (width: number) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    return page.evaluate(() =>
      parseFloat(getComputedStyle(document.querySelector("h1")!).fontSize)
    );
  };

  const small = await h1At(600);
  const large = await h1At(1440);
  expect(large).toBeGreaterThan(small);
});
