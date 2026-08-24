import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Steady/', // Fixed base path matching GitHub Pages repo (https://kaustobh.github.io/Steady/)
})
