import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}
export default defineConfig({
  test: {
    // ...
    alias: [
      {
        find: /^@root\//,
        replacement: pathResolve('.') + '/',
      },
      {
        find: /^@\//,
        replacement: pathResolve('src') + '/',
      },
      {
        find: /^\/@\//,
        replacement: pathResolve('src/render') + '/',
      }
    ],
    environment: 'jsdom',
  },
});
