import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true, // Automatically open browser
  },
  resolve: {
    alias: {
      '@': '/src', // Allows @/components/Button instead of ../../../components/Button
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true, // Helpful for debugging
  }
})
