import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  root: '.',
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    manifest: true,
    lib: {
      entry: path.resolve(__dirname, 'assets/js/main.js'),
      name: 'ilebenTheme',
      fileName: (format) => `assets/main-[hash].js`,
      formats: ['iife']
    },
    rollupOptions: {
      output: {
        entryFileNames: 'assets/main-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  },
  server: {
    port: 5173,
    strictPort: true
  },
  resolve: {
    alias: {
      '@scss': path.resolve(__dirname, 'assets/scss'),
      '@js': path.resolve(__dirname, 'assets/js')
    }
  }
});
