import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3050",
    trace: "on-first-retry",
    channel: "chrome",
    ...devices["Desktop Chrome"],
  },
  webServer: {
    command: "npm run start -- --port 3050",
    url: "http://127.0.0.1:3050/en",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      PLAYWRIGHT_TEST_MODE: "1",
    },
  },
});
