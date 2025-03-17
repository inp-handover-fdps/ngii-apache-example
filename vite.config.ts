import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/ngii": {
        target: "https://map.ngii.go.kr",
        rewrite: (path) => path.replace(/^\/ngii/, ""),
        changeOrigin: true,
      },
    },
  },
});
