import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        woodstock: resolve(__dirname, "woodstock.html"),
        woodstockd1: resolve(__dirname, "woodstock_day-1.html"),
      },
    },
  },
  server: {
    proxy: {
      "/auth": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/hello": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
