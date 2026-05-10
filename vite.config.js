import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/phi369-element-spiral-atlas/",
  plugins: [react()],
  build: {
    sourcemap: true,
  },
});
