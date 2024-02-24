import minimist from 'minimist';
import terser from '@rollup/plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve';
import shebang from 'rollup-plugin-preserve-shebang'
import json from '@rollup/plugin-json'
import typescript from 'rollup-plugin-typescript2';
import fs from 'fs-extra'
import path from 'path'
import externals from 'rollup-plugin-node-externals';
import alias from '@rollup/plugin-alias';
import { getAllFiles, removeAndReturnItems } from './build/utils.mjs';
import replace from '@rollup/plugin-replace';
import { string } from 'rollup-plugin-string';

const argv = minimist(process.argv.slice(2))

fs.ensureDirSync('dist')
fs.ensureDirSync('dist/widgets')
fs.ensureDirSync('dist/mock')
fs.copyFileSync('src/server/mock/server.conf', 'dist/mock/server.conf')

const widgets = getAllFiles('./src/widgets', null, /\.(js|ts)/, {})
// const widgets = []
const devPlugins = []
// const buildPlugins = [terser()]
const buildPlugins = []
const commonPlugins = [
  json(),
  resolve(),
  commonjs(),
  externals({
    exclude: ['clipboardy', 'crypto-random-string']
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
      file: 'dist/bundle.js',
      format: 'cjs',
    },
  },
  {
    input: 'src/server/mock/index.ts',
    plugins: commonPlugins,
    output: {
      file: 'dist/mock/index.js',
      format: 'cjs',
      sourcemap: 'inline',
    },
  },
]

const widgetChunks = widgets.map(widget => {
  return {
    name: path.parse(widget.path).name,
    input: widget.path,
    plugins: [
      widget.path.indexOf('codeToSnippetBody') !== -1 ? alias({
        entries: [
          { find: 'clipboardy', replacement: 'node_modules/clipboardy/index.js' },
        ]
      }) : widget.path.indexOf('cryptoRandomString') !== -1 ? alias({
        entries: [
          { find: 'crypto-random-string', replacement: 'node_modules/crypto-random-string/index.js' },
        ]
      }) : null,
      replace({
        '#! /usr/bin/env node': '',
        '#!/usr/bin/env node': '',
        preventAssignment: true,
        delimiters: ['', ''],
        include: [/http-server/, /yapi-to-typescript/],
      }),
      ...commonPlugins
    ],
    output: {
      file: `dist/widgets/${path.parse(widget.path).name}.js`,
      format: 'cjs',
      sourcemap: true,
    },
  }
})

baseChunks.push(...removeAndReturnItems(widgetChunks, widget => ['index', 'runNpmTasks', 'ytt'].indexOf(widget.name) !== -1))

const chunks = argv.filter?.length > 0 ? widgetChunks.filter(item => item.input.indexOf(argv.filter) !== -1) : baseChunks

if (argv.filter?.length > 0 && !chunks.length) {
  throw new Error(`未找到名称为${argv.filter}的任务`)
}

export default chunks
