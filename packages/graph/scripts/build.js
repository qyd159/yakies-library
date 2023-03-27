const esbuild = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');

esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  sourcemap: true,
  watch: true,
  platform: 'browser',
  outfile: 'dist/index.js',
  format: 'esm',
  target: 'es6',
  plugins: [
    nodeExternalsPlugin({
      allowList: [],
    }),
  ],
});
