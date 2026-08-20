import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

// 테스트에서 Supabase 저장을 직접 검증하므로 .env.local 이 필요하다.
dotenv.config({ path: ".env.local" });

const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  // E2E_BASE_URL 로 배포된 사이트를 겨냥할 때는 dev 서버를 띄우지 않는다.
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
