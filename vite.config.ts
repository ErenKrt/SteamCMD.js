// vite.config.ts
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
// https://vitejs.dev/guide/build.html#library-mode

/// <reference types="vitest" />
// Configure Vitest (https://vitest.dev/config/)

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SteamCMD',
      fileName: 'SteamCMD'
    },
  },
  plugins: [dts()],
  test: {}
});