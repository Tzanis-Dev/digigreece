import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    testTimeout: 10000,
    hookTimeout: 10000,
    pool: 'forks',
    poolOptions: {
      threads: {
        singleThread: true
      }
    },
    logHeapUsage: true,
    reporters: ['verbose'],
    sequence: {
      shuffle: false
    },
    maxConcurrency: 1,
    minThreads: 1,
    maxThreads: 1,
    silent: false,
    watch: false
  },
});