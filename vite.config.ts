import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss(),],
  // resolve: {
  //   alias: { "@": path.resolve(__dirname, "src") },
  // },
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
  server: {
    host: true, // нужно для внешних подключений (tuna, LAN и т.д.)
    port: 5173,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      ".tuna.am", // <-- разрешаем любые поддомены tuna.am
    ],
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000", // Django backend
        changeOrigin: true,
      },
    },
  },
});
