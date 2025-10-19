import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/nessie': {
        target: 'http://api.nessieisreal.com',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/nessie/, ''),
        secure: false,
      },
    },
  },
})
