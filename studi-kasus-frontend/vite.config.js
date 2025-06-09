import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/food-frontend/',
  plugins: [react()],
  server: {
    proxy: {
      "/api-wilayah": {
        target: "https://emsifa.github.io",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-wilayah/, ""),
      },
    },
  },
});
