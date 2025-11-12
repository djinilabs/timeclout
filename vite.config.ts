import path from "path";

import { lingui } from "@lingui/vite-plugin";
import react from "@vitejs/plugin-react-swc";
import graphqlLoader from "vite-plugin-graphql-loader";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    react({
      plugins: [["@lingui/swc-plugin", {}]],
    }),
    graphqlLoader(),
    tsconfigPaths(),
    lingui(),
  ],

  resolve: {
    alias: {
      "@/graphql-client": path.resolve(
        __dirname,
        "./apps/frontend/src/graphql"
      ),
    },
  },

  define: {
    "process.env": {},
    global: "globalThis",
  },

  server: {
    open: process.env.E2E_NO_UI !== "true",
  },

  worker: {
    plugins: () => [tsconfigPaths()],
    format: "es",
  },

  build: {
    sourcemap: true,
  },

  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    testTimeout: process.env.CI ? 10000 : 5000,
    exclude: ["**/node_modules/**", "**/dist/**", "**/.{idea,git,cache,output,temp}/**"],
  },
});
