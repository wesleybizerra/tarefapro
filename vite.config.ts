import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      // Garante que o buffer seja resolvido corretamente
      buffer: 'buffer'
    }
  },
  define: {
    // Alguns pacotes esperam 'global', definimos como window
    global: 'window',
  },
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
});