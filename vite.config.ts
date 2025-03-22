import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    minify: false, // ✅ แก้ให้ถูกที่ (อยู่ใน `build`)
    sourcemap: true, // ✅ เปิด source map
  },
  base: "/dsbi-mapping/", // ✅ เปลี่ยนให้ตรงกับชื่อ Repo
});


