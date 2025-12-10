import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Polyfill process.env for compatibility with the existing code structure if needed,
    // though we prefer import.meta.env in Vite.
    'process.env': process.env
  }
});