import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      "@chakra-ui/react",
      "@emotion/react",
      "@emotion/styled",
      "framer-motion",
    ],
  },
  server: {
    port: 3000,
    proxy: {
      "/v1": {
        target: "http://localhost:8000/api",
        changeOrigin: true,
        secure: false,
      },
    },

    watch: {
      usePolling: true,
    },
  },
});
