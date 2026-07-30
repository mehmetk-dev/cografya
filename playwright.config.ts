import { defineConfig, devices } from "@playwright/test";

const chromiumExecutable =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ??
  "/home/mehmetkerem/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:5173",
    browserName: "chromium",
    launchOptions: {
      executablePath: chromiumExecutable,
    },
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 1000 },
      },
    },
    {
      name: "mobile-320",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 320, height: 700 },
        hasTouch: true,
      },
    },
    {
      name: "mobile-390",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 390, height: 844 },
        hasTouch: true,
      },
    },
    {
      name: "mobile-430",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 430, height: 932 },
        hasTouch: true,
      },
    },
  ],
  webServer: {
    command: "VITE_E2E_AUTH_BYPASS=true npm run dev -- --host 127.0.0.1",
    url: "http://127.0.0.1:5173",
    reuseExistingServer: true,
  },
});
