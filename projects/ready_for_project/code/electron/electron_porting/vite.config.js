import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',  // Important: Use relative paths for Electron
  build: {
    outDir: 'dist'
  }
})
