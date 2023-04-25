import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import shebang from 'rollup-plugin-preserve-shebang'
import json from '@rollup/plugin-json'
import typescript from 'rollup-plugin-typescript2';
import fs from 'fs-extra'
import path from 'path'

const { getAllFiles } = require('./src/lib/util')
fs.ensureDirSync('dist')
fs.ensureDirSync('dist/widgets')
fs.ensureDirSync('dist/mock')
fs.copyFileSync('server/mock/server.conf', 'dist/mock/server.conf')

const widgets = getAllFiles('./widgets', null, '.js', {})

export default [
  {
    input: 'src/index.ts',
    external(id) {
      return id.indexOf('node_modules') >= 0
    },
    plugins: [
      shebang(),
      json(),
      commonjs({
        dynamicRequireTargets: ['devtool/lib/*.js'],
        requireReturnsDefault: 'auto',
        extensions: ['.js'],
        ignoreGlobal: false,
        sourceMap: false,
      }),
      terser(),
      typescript()
    ],
    output: {
      file: 'dist/bundle.js',
      format: 'cjs',
    },
  },
  {
    input: 'server/mock/index.js',
    external(id) {
      return id.indexOf('node_modules') >= 0
    },
    plugins: [
      commonjs({
        requireReturnsDefault: 'auto',
        extensions: ['.js'],
        sourceMap: false,
      }),
      terser(),
    ],
    output: {
      file: 'dist/mock/index.js',
      format: 'cjs',
    },
  },
].concat(widgets.map(widget => {
  return {
    input: widget.path,
    external(id) {
      return id.indexOf('node_modules') >= 0
    },
    plugins: [
      commonjs({
        requireReturnsDefault: 'auto',
        extensions: ['.js'],
        sourceMap: false,
      }),
      terser(),
    ],
    output: {
      file: `dist/widgets/${path.parse(widget.path).name}.js`,
      format: 'cjs',
    },
  }
}))
