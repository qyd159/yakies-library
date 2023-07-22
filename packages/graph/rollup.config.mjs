import minimist from 'minimist';
import terser from '@rollup/plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve';
import shebang from 'rollup-plugin-preserve-shebang'
import json from '@rollup/plugin-json'
import typescript from 'rollup-plugin-typescript2';
import fs from 'fs-extra'
import externals from 'rollup-plugin-node-externals';
import { string } from 'rollup-plugin-string';

const argv = minimist(process.argv.slice(2))

fs.ensureDirSync('dist')

// const widgets = []
const devPlugins = []
const buildPlugins = [terser()]
const commonPlugins = [
  json(),
  resolve(),
  commonjs(),
  externals({
    exclude: ['clipboardy']
  }),
  string({
    // 导入 .tpl 和 .glsl 文件
    include: "**/*.tpl",
  }),
  typescript({
    cacheRoot: '.cache',
    outDir: "es",
    declaration: true,
    declarationDir: "es",
  }),
  ...(argv.dev ? devPlugins : buildPlugins),
]

const baseChunks = [
  {
    input: 'src/index.ts',
    plugins: [
      shebang(),
      ...commonPlugins,
    ],
    output: {
      sourcemap: 'inline',
      file: 'dist/index.js',
      format: 'es',
    },
  },
]

export default baseChunks
