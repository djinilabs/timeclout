import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    open: true,
    port: 3000,

    proxy: {
      "/graphql": {
        target: "http://localhost:3333",
        changeOrigin: true,
      },
    },
  },
  build: {
    sourcemap: true,
    outDir: "../backend/public",
  },
});
