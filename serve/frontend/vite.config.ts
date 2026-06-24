import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@pergola/engine/styles', replacement: resolve(__dirname, '../../packages/engine/src/styles/index.css') },
      { find: '@pergola/engine',        replacement: resolve(__dirname, '../../packages/engine/src') },
    ],
  },
  server: {
    port: 5174,
    proxy: {
      '/api': { target: 'http://localhost:5001', changeOrigin: true },
    },
  },
  build: {
    outDir: '../app/static',
    emptyOutDir: true,
  },
})
