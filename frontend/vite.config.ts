import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '127.0.0.1',
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
