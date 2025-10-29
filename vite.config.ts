/// <reference types="vitest" />

import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['lib'],
      tsconfigPath: './tsconfig.app.json',
      outDir: 'dist/types',
      insertTypesEntry: true,
    }),
  ],
  build: {
    copyPublicDir: false,
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
  test: {
    globals: true,
    coverage: {
      reporter: ['text', 'html'],
      include: ['lib/**/*.ts', 'lib/**/*.tsx'],
      exclude: ['**/index.ts', '**/utils/tests.ts'],
    },
    environment: 'jsdom',
    setupFiles: './setupTest.ts',
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    include: [
      'lib/**/*.test.ts',
      'lib/**/*.test.tsx',
      'lib/**/*.spec.ts',
      'lib/**/*.spec.tsx',
    ],
  },
});
