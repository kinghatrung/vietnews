import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "~": path.resolve("src"),
    },
  },
  base: "/",
  server: {
    hmr: {
      overlay: true,
    },
  },
  build: {
    target: "es2017", // hoặc es2020
  },
});
