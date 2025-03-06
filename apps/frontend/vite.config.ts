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
  server: {
    open: true,
    port: 3000,

    proxy: {
      "/homepage": {
        target: "http://localhost:3333",
        changeOrigin: true,
      },
      "/graphql": {
        target: "http://localhost:3333",
        changeOrigin: true,
      },
      "/api": {
        target: "http://localhost:3333",
        changeOrigin: true,
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
    "process.env": {},
    global: "globalThis",
  },
  worker: {
    plugins: () => [tsconfigPaths()],
    format: "es",
  },
});
