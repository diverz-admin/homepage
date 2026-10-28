import { expect, test, type Page } from "@playwright/test";
import { deleteContactsByPhone, testSupabase } from "./helpers/supabase";

/** 실행마다 고유한 연락처를 써서 테스트끼리 서로 간섭하지 않게 한다. */
function uniquePhone() {
  const tail = String(Date.now()).slice(-8);
  return `010-${tail.slice(0, 4)}-${tail.slice(4)}`;
}

/** 서버의 최소 작성 시간(3초)보다 늦게 제출하도록 기다린다. */
async function waitPastMinFillTime(page: Page) {
  await page.waitForTimeout(3200);
}

async function fillRequired(page: Page, phone: string) {
  await page.locator('input[name="inquiryTypes"]').first().check();
  await page.getByLabel("업체명 *").fill("E2E 테스트 업체");
  await page.getByLabel("성함 *").fill("E2E 테스터");
  await page.getByLabel("연락처 *").fill(phone);
  await page.getByLabel("개인정보 수집에 동의합니다.").check();
}

test.describe("DB 저장 (.env.local 필요)", () => {
  test.skip(
    !process.env.SUPABASE_SERVICE_ROLE_KEY,
    "Supabase 환경변수가 없어 건너뛴다."
  );

  test("문의 폼을 제출하면 성공 메시지가 뜨고 Supabase에 저장된다", async ({ page }) => {
    const phone = uniquePhone();

    try {
      await page.goto("/contact");
      await fillRequired(page, phone);
      await page.getByLabel("이메일").fill("e2e@e2e.diverz.test");
      await page.getByLabel("예산").selectOption("아직 미정");
      await waitPastMinFillTime(page);

      await page.getByRole("button", { name: "간편 문의하기" }).click();

      await expect(page.getByText("문의가 정상적으로 접수되었습니다.")).toBeVisible();
      // 제출 후 폼이 초기화된다.
      await expect(page.getByLabel("성함 *")).toHaveValue("");

      // 화면 메시지만 믿지 않고 DB에 실제로 들어갔는지 확인한다.
      const { data, error } = await testSupabase()
        .from("contacts")
        .select("name, phone, email, company, budget, consent, inquiry_types")
        .eq("phone", phone);

      expect(error).toBeNull();
      expect(data).toHaveLength(1);
      expect(data![0]).toMatchObject({
        name: "E2E 테스터",
        phone,
        email: "e2e@e2e.diverz.test",
        company: "E2E 테스트 업체",
        budget: "아직 미정",
        consent: true,
      });
      expect(data![0].inquiry_types.length).toBeGreaterThan(0);
    } finally {
      await deleteContactsByPhone(phone);
    }
  });

  test("이메일/예산은 선택 항목이라 비워도 접수된다", async ({ page }) => {
    const phone = uniquePhone();

    try {
      await page.goto("/contact");
      await fillRequired(page, phone);
      await waitPastMinFillTime(page);

      await page.getByRole("button", { name: "간편 문의하기" }).click();
      await expect(page.getByText("문의가 정상적으로 접수되었습니다.")).toBeVisible();

      const { data } = await testSupabase()
        .from("contacts")
        .select("email, budget")
        .eq("phone", phone);

      expect(data).toHaveLength(1);
      expect(data![0]).toMatchObject({ email: null, budget: null });
    } finally {
      await deleteContactsByPhone(phone);
    }
  });

  test("함정 칸이 채워진 제출은 성공처럼 보이지만 저장되지 않는다", async ({ page }) => {
    const phone = uniquePhone();

    try {
      await page.goto("/contact");
      await fillRequired(page, phone);
      await page.locator('input[name="website"]').fill("http://spam.example");
      await waitPastMinFillTime(page);

      await page.getByRole("button", { name: "간편 문의하기" }).click();
      await expect(page.getByText("문의가 정상적으로 접수되었습니다.")).toBeVisible();

      const { data } = await testSupabase().from("contacts").select("id").eq("phone", phone);
      expect(data).toHaveLength(0);
    } finally {
      await deleteContactsByPhone(phone);
    }
  });
});

test("필수 항목이 비면 제출되지 않는다", async ({ page }) => {
  await page.goto("/contact");

  let requestSent = false;
  page.on("request", (request) => {
    if (request.url().includes("/api/contact")) requestSent = true;
  });

  // 성함만 채우고 제출 → 브라우저 기본 검증에 막혀야 한다.
  await page.getByLabel("성함 *").fill("성함만 입력");
  await page.getByRole("button", { name: "간편 문의하기" }).click();

  await expect(page.getByText("문의가 정상적으로 접수되었습니다.")).toBeHidden();
  expect(requestSent).toBe(false);
});

test("함정 칸은 화면에 보이지 않는다", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.locator('input[name="website"]')).not.toBeInViewport();
});

test.describe("API 서버측 검증", () => {
  const valid = {
    name: "API 테스트",
    phone: "010-0000-0000",
    consent: true,
    elapsedMs: 5000,
  };

  test("필수 항목이 없으면 400을 반환한다", async ({ request }) => {
    const response = await request.post("/api/contact", {
      data: { ...valid, name: "", consent: false },
    });

    expect(response.status()).toBe(400);
    expect((await response.json()).error).toContain("필수");
  });

  test("연락처 형식이 틀리면 400을 반환한다", async ({ request }) => {
    const response = await request.post("/api/contact", {
      data: { ...valid, phone: "전화번호" },
    });

    expect(response.status()).toBe(400);
    expect((await response.json()).error).toContain("연락처 형식");
  });

  test("이메일 형식이 틀리면 400을 반환한다", async ({ request }) => {
    const response = await request.post("/api/contact", {
      data: { ...valid, email: "not-an-email" },
    });

    expect(response.status()).toBe(400);
    expect((await response.json()).error).toContain("이메일 형식");
  });

  test("함정 칸이 채워지면 저장 없이 201로 응답한다", async ({ request }) => {
    const response = await request.post("/api/contact", {
      data: { ...valid, website: "http://spam.example" },
    });
    expect(response.status()).toBe(201);
  });

  test("너무 빨리 제출되면 저장 없이 201로 응답한다", async ({ request }) => {
    const response = await request.post("/api/contact", {
      data: { ...valid, elapsedMs: 500 },
    });
    expect(response.status()).toBe(201);
  });
});
