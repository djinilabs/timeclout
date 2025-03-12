import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import graphqlLoader from "vite-plugin-graphql-loader";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import { lingui } from "@lingui/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
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

  worker: {
    plugins: () => [tsconfigPaths()],
    format: "es",
  },

  build: {
    sourcemap: true,
  },
});
