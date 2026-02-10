import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  tailwindcss()
  ],
  esbuild: {
    loader: 'jsx', // Ensure JSX loader is set
    include: [
      // Ensure .js files are treated as JSX
      'src/**/*.js',
      'src/**/*.jsx',
    ],
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
