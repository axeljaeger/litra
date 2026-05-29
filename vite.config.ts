import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  build: {
    emptyOutDir: true,
    outDir: '../dist',
    target: 'es2022',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['**/*.test.ts'],
  },
});
