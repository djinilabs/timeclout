import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import graphqlLoader from "vite-plugin-graphql-loader";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import { lingui } from "@lingui/vite-plugin";
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

  worker: {
    plugins: () => [tsconfigPaths()],
    format: "es",
  },

  build: {
    sourcemap: true,
  },
});
