import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

function pathResolve(dir: string) {
  return resolve(__dirname, '.', dir);
}
export default defineConfig({
  test: {
    // ...
    alias: [
      {
        find: /^@\//,
        replacement: pathResolve('src') + '/',
      },
    ],
    environment: 'jsdom',
  },
});
