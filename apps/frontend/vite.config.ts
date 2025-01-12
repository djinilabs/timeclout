import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

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
      "@/auth-config": path.resolve(__dirname, "../../libs/auth-config/src"),
      "@/utils": path.resolve(__dirname, "../../libs/utils/src"),
      "@/settings": path.resolve(__dirname, "../../libs/settings/src"),
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
});
