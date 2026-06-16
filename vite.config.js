import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor':  ['react', 'react-dom', 'react-router-dom'],
          'monaco':        ['@monaco-editor/react', 'monaco-editor'],
          'gsap':          ['gsap'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['@monaco-editor/react', 'gsap'],
  },
});
