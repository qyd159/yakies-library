import AutoImport from 'unplugin-auto-import/vite';
import { resolve } from 'path';
const r = (...args: string[]) => resolve(__dirname, '../../../', ...args);

export default [
  // https://github.com/antfu/unplugin-vue-components
  AutoImport({
    imports: [
      'vue',
      {
        'webextension-polyfill': [['*', 'browser']],
      },
    ],
    dts: r('src/auto-imports.d.ts'),
  }),
];
