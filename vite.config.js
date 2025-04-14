import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://globalwayout.in',
        changeOrigin: true,
        secure: false, // only if the site has self-signed cert
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});

