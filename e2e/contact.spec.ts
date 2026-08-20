import { expect, test } from "@playwright/test";
import { deleteContactsByEmail, testSupabase } from "./helpers/supabase";

/** 실행마다 고유한 이메일을 써서 테스트끼리 서로 간섭하지 않게 한다. */
function uniqueEmail() {
  return `e2e-${Date.now()}-${Math.floor(Math.random() * 1e6)}@e2e.diverz.test`;
}

test("문의 폼을 제출하면 성공 메시지가 뜨고 Supabase에 저장된다", async ({ page }) => {
  const email = uniqueEmail();

  try {
    await page.goto("/contact");

    await page.getByLabel("이름 *").fill("E2E 테스터");
    await page.getByLabel("이메일 *").fill(email);
    await page.getByLabel("회사명").fill("프롬에그");
    await page.getByLabel("문의 내용 *").fill("Playwright E2E 자동 테스트 문의입니다.");

    await page.getByRole("button", { name: "문의 보내기" }).click();

    await expect(
      page.getByText("문의가 정상적으로 접수되었습니다.")
    ).toBeVisible();

    // 제출 후 폼이 초기화된다.
    await expect(page.getByLabel("이름 *")).toHaveValue("");

    // 화면 메시지만 믿지 않고 DB에 실제로 들어갔는지 확인한다.
    const { data, error } = await testSupabase()
      .from("contacts")
      .select("name, email, company, message")
      .eq("email", email);

    expect(error).toBeNull();
    expect(data).toHaveLength(1);
    expect(data![0]).toMatchObject({
      name: "E2E 테스터",
      email,
      company: "프롬에그",
      message: "Playwright E2E 자동 테스트 문의입니다.",
    });
  } finally {
    await deleteContactsByEmail(email);
  }
});

test("회사명은 선택 항목이라 비워도 접수된다", async ({ page }) => {
  const email = uniqueEmail();

  try {
    await page.goto("/contact");

    await page.getByLabel("이름 *").fill("회사명 없음");
    await page.getByLabel("이메일 *").fill(email);
    await page.getByLabel("문의 내용 *").fill("회사명 없이 보내는 문의입니다.");

    await page.getByRole("button", { name: "문의 보내기" }).click();
    await expect(
      page.getByText("문의가 정상적으로 접수되었습니다.")
    ).toBeVisible();

    const { data } = await testSupabase()
      .from("contacts")
      .select("company")
      .eq("email", email);

    expect(data).toHaveLength(1);
    expect(data![0].company).toBeNull();
  } finally {
    await deleteContactsByEmail(email);
  }
});

test("필수 항목이 비면 제출되지 않는다", async ({ page }) => {
  await page.goto("/contact");

  let requestSent = false;
  page.on("request", (request) => {
    if (request.url().includes("/api/contact")) requestSent = true;
  });

  // 이름만 채우고 제출 → 브라우저 기본 검증에 막혀야 한다.
  await page.getByLabel("이름 *").fill("이름만 입력");
  await page.getByRole("button", { name: "문의 보내기" }).click();

  await expect(
    page.getByText("문의가 정상적으로 접수되었습니다.")
  ).toBeHidden();
  expect(requestSent).toBe(false);
});

test.describe("API 서버측 검증", () => {
  test("이메일 형식이 틀리면 400을 반환하고 저장하지 않는다", async ({ request }) => {
    const response = await request.post("/api/contact", {
      data: { name: "잘못된 이메일", email: "not-an-email", message: "테스트" },
    });

    expect(response.status()).toBe(400);
    expect((await response.json()).error).toContain("이메일 형식");
  });

  test("필수 항목이 없으면 400을 반환한다", async ({ request }) => {
    const response = await request.post("/api/contact", {
      data: { name: "", email: "", message: "" },
    });

    expect(response.status()).toBe(400);
    expect((await response.json()).error).toContain("필수");
  });
});
