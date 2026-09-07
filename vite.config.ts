/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// GitHub Pages serves this site under the repository name (/scholarship/).
// The deploy workflow sets GITHUB_PAGES=true; local dev/preview keep "/".
const base = process.env.GITHUB_PAGES === 'true' ? '/scholarship/' : '/';

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
  },
  preview: {
    host: true,
    port: 4173,
    allowedHosts: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    // Process CSS so `?raw` imports behave exactly like in the app
    // (the contrast gate and the style guide read tokens.css this way).
    // Only main.tsx imports CSS outside of `?raw`, and it is never under
    // test, so this costs nothing.
    css: true,
    env: {
      // Deterministic, fast tests: no simulated network latency.
      VITE_MOCK_LATENCY: 'false',
    },
    restoreMocks: true,
    unstubGlobals: true,
  },
});
