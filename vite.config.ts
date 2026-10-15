import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Backend the dev server proxies /api to. Default = the API's https launch profile; set VITE_PROXY_TARGET to point
// elsewhere, e.g. VITE_PROXY_TARGET=http://localhost:5206 for the http profile or the Docker image.
const apiTarget = process.env.VITE_PROXY_TARGET || 'https://localhost:7068'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
