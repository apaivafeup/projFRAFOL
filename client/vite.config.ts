import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/components"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@context": path.resolve(__dirname, "src/context"), //
      "@services": path.resolve(__dirname, "src/services"), //
      "@pages": path.resolve(__dirname, "src/pages"), //
      "@icons": path.resolve(__dirname, "src/icons"), //
    },
  },
  server: {
    host: "0.0.0.0", // Allow connections from any network interface
    port: 5173,
    strictPort: true,
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: true,
  },
});
