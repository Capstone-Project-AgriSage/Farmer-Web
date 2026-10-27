import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Backend the dev server proxies /api to. Default = the API's http launch profile (port 5206); set VITE_PROXY_TARGET to
// point elsewhere, e.g. VITE_PROXY_TARGET=https://localhost:7068 for the https profile.
const apiTarget = process.env.VITE_PROXY_TARGET || 'http://localhost:5206'

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
        ws: true,
      },
    },
  },
})
