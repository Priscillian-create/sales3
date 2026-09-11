import path from "node:path";
import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "netlify",
  publicDir: path.resolve(__dirname, "public"),
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist/netlify"),
    emptyOutDir: true,
  },
});
