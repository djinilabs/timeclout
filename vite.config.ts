import path from "path";

import { lingui } from "@lingui/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import graphqlLoader from "vite-plugin-graphql-loader";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    react({
      babel: {
        plugins: [
          ["babel-plugin-react-compiler", {}],
          ["@lingui/babel-plugin-lingui-macro", {}],
        ],
      },
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
  },
});
