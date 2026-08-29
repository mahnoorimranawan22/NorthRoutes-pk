import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
// VERCEL env var is set during build on Vercel, undefined locally
const isVercel = process.env.VERCEL === "1";

export default defineConfig(({ mode }) => ({
  base: isVercel ? "/" : (mode === "production" ? "/NorthRoutes-pk/" : "/"),
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
}));
