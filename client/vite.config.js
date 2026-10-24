import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The backend has no CORS configured, so in development we proxy all /api
// requests to the Express server on port 3000. This makes requests same-origin
// from the browser's perspective, so cookies and auth work without touching
// the (read-only) backend.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        cookieDomainRewrite: "localhost",
      },
    },
  },
});
