// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') // Fix path alias
    }
  },
  build: {
    outDir: 'dist',       // Ensure output is in dist/
    emptyOutDir: true     // Clear dist/ before each build
  }
});