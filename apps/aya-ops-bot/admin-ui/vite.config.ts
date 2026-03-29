import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/admin/",
  plugins: [react()],
  server: {
    proxy: {
      "/auth": {
        target: process.env.AYA_ADMIN_API_URL ?? "http://127.0.0.1:3010",
        changeOrigin: true,
      },
      "/admin/api": {
        target: process.env.AYA_ADMIN_API_URL ?? "http://127.0.0.1:3010",
        changeOrigin: true,
      },
      "/employees": {
        target: process.env.AYA_ADMIN_API_URL ?? "http://127.0.0.1:3010",
        changeOrigin: true,
      },
      "/identity-links": {
        target: process.env.AYA_ADMIN_API_URL ?? "http://127.0.0.1:3010",
        changeOrigin: true,
      },
    },
  },
});
