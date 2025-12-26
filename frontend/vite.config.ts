import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '127.0.0.1',
    headers: {
      'Content-Security-Policy': "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob:; object-src 'self';"
    },
    hmr: {
      host: '127.0.0.1',
      port: 5173,
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: false,
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      supported: {
        bigint: true,
      },
    },
    include: [
      'react',
      'react-dom',
      '@tanstack/react-query',
    ],
  },
  define: {
    global: 'globalThis',
    'process.env': {},
  },
})
