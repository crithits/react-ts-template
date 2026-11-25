/// <reference types="vitest/config" />
import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  // React Compiler handles memoization, so components don't need useMemo/useCallback.
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
