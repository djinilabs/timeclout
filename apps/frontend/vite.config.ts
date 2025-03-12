import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import graphqlLoader from "vite-plugin-graphql-loader";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import { lingui } from "@lingui/vite-plugin";
import { sentryVitePlugin } from "@sentry/vite-plugin";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      plugins: [["@lingui/swc-plugin", {}]],
    }),
    tailwindcss(),
    graphqlLoader(),
    tsconfigPaths(),
    lingui(),
    sentryVitePlugin({
      org: "tt3",
      project: "tt3",
    }),
  ],
  server: {
    open: true,
    port: 3000,

    proxy: {
      "/graphql": {
        target: "http://localhost:3333",
        changeOrigin: true,
      },
      "/api": {
        target: "http://localhost:3333",
      },
    },
  },
  resolve: {
    alias: {
      "@/graphql-client": path.resolve(__dirname, "./src/graphql"),
    },
  },
  build: {
    sourcemap: true,
    outDir: "../backend/public",
  },
  define: {
    "process.env": {
      VITE_PUBLIC_SENTRY_DSN: process.env.VITE_PUBLIC_SENTRY_DSN,
      VITE_PUBLIC_POSTHOG_KEY: process.env.VITE_PUBLIC_POSTHOG_KEY,
      VITE_PUBLIC_POSTHOG_HOST: process.env.VITE_PUBLIC_POSTHOG_HOST,
    },
    global: "globalThis",
  },
  worker: {
    plugins: () => [tsconfigPaths()],
    format: "es",
  },
});
