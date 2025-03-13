import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://auth.privy.io", // Correct API target
        changeOrigin: true, // Allows cross-origin requests
        secure: true, // Ensures HTTPS is used
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      buffer: "buffer", // Buffer alias added
    },
  },
  define: {
    "process.env": {}, // Define process.env to avoid issues
  },
  optimizeDeps: {
    include: ["buffer"], // Ensures buffer is included in dependencies
  },
  base: "./",
});
