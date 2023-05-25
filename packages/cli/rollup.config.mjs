import terser from '@rollup/plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve';
import shebang from 'rollup-plugin-preserve-shebang'
import json from '@rollup/plugin-json'
import typescript from 'rollup-plugin-typescript2';
import fs from 'fs-extra'
import path from 'path'
import externals from 'rollup-plugin-node-externals';
import { getAllFiles } from './build/utils.mjs';

fs.ensureDirSync('dist')
fs.ensureDirSync('dist/widgets')
fs.ensureDirSync('dist/mock')
fs.copyFileSync('src/server/mock/server.conf', 'dist/mock/server.conf')

const widgets = getAllFiles('./src/widgets', null, '.js', {})
// const widgets = []
const commonPlugins = [
      json(),
      resolve(),
      commonjs(),
      externals(),
      // terser(),
      typescript({
        outDir: "es",
        declaration: true,
        declarationDir: "es",
      })]

export default [
  {
    input: 'src/index.ts',
    plugins: [
      shebang(),
      ...commonPlugins,
    ],
    output: {
      sourcemap: 'inline',
      file: 'dist/bundle.js',
      format: 'cjs',
    },
  },
  {
    input: 'src/server/mock/index.js',
    plugins: [],commonPlugins,
    output: {
      file: 'dist/mock/index.js',
      format: 'cjs',
      sourcemap: 'inline',
    },
  },
].concat(widgets.map(widget => {
  return {
    input: widget.path,
    plugins: commonPlugins,
    output: {
      file: `dist/widgets/${path.parse(widget.path).name}.js`,
      format: 'cjs',
      sourcemap: 'inline',
    },
  }
}))
