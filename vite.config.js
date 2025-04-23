import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

