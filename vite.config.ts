/// <reference types="vitest" />
/// <reference types="vite/client" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()], //Array of plugins to use.
  base: "/",
  preview: { 
    port: 6969, 
    strictPort: true,
  },
  server: {
    port: 6969, 
    strictPort: true,
    host: true, 
 },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js'
  },
})