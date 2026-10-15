import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["mockups/site-ready/**/*.test.tsx"],
  },
});
