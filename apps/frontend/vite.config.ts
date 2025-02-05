import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import graphqlLoader from "vite-plugin-graphql-loader";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), graphqlLoader(), tsconfigPaths()],

  server: {
    open: true,
    port: 3000,

    proxy: {
      "/graphql": {
        target: "http://localhost:3333",
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
    "process.env": {},
    global: "globalThis",
  },
  worker: {
    plugins: () => [tsconfigPaths()],
    format: "es",
  },
});
