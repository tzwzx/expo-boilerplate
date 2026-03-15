import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e/web",
  testMatch: "**/*.e2e.ts",
  use: {
    browserName: "chromium",
  },
});
