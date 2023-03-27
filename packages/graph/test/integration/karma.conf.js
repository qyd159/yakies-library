// Karma configuration
// Generated on Fri Oct 30 2020 15:52:54 GMT+0800 (China Standard Time)
const path = require('path');
const browserResolve = require('browser-resolve');
const requireHijack = require('require-hijack');
const fakeBrowserResolve = function (id, opts, cb) {
  if (id === 'buffer') {
    cb(null, opts.modules.buffer);
    return;
  }
  browserResolve(id, opts, cb);
};
requireHijack.replace('browser-resolve').with(fakeBrowserResolve);

module.exports = function (config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../..',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'karma-typescript'],

    // list of files / patterns to load in the browser
    files: [
      { pattern: 'test/assets/**/*.woff', watched: false, included: false, served: true, nocache: false },
      { pattern: 'test/assets/**/*.js' },
      { pattern: 'test/assets/**/*.css' },
      { pattern: 'src/**/*.ts' },
      { pattern: 'dist/styles/*.css' },
      { pattern: 'test/integration/**/*.test.ts' },
      'test/integration/html/*.html',
    ],

    // list of files / patterns to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '**/*.html': ['html2js'],
      '**/*.ts': 'karma-typescript',
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec', 'karma-typescript'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeDebugging'],

    customLaunchers: {
      ChromeDebugging: {
        base: 'Chrome',
        flags: ['--remote-debugging-port=9333'],
      },
    },
    captureTimeout: 60000,
    browserNoActivityTimeout: 60000,
    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    customContextFile: 'test/integration/test.html',

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,
    client: {
      clearContext: false,
      mocha: {
        opts: 'test/integration/mocha.opts'
      },
    },
    karmaTypescriptConfig: {
      bundlerOptions: {
        addNodeGlobals: true,
        entrypoints: /entry\.test\.ts$/,
        transforms: [
          require('karma-typescript-es6-transform')({
            // no 'use strict;'
            sourceType: 'unambiguous',
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: '> 0.1%, not dead',
                  useBuiltIns: 'usage',
                  corejs: 3,
                },
              ],
            ],
            plugins: [
              [
                '@babel/plugin-transform-runtime',
                {
                  absoluteRuntime: false,
                  corejs: false,
                  helpers: true,
                  regenerator: false,
                },
              ],
              // no 'use strict;'
              ['@babel/plugin-transform-modules-commonjs', { strictMode: false }],
            ],
          }),
        ],
        sourceMap: true,
      },
      compilerOptions: {
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
        module: 'commonjs',
        sourceMap: true,
        target: 'ES5',
        downlevelIteration: true,
      },
      exclude: ['node_modules'],
      coverageOptions: {
        instrumentation: false,
      },
      tsconfig: './test/integration/tsconfig.json',
      stopOnFailure: false,
    },
    html2JsPreprocessor: {
      // strip this from the file path
      stripPrefix: 'public/',

      // prepend this to the file path
      prependPrefix: 'served/',

      // or define a custom transform function
      processPath: function (filePath) {
        // Drop the file extension
        return filePath.replace(/^(.*?)([\p{Unified_Ideograph}|\w]+)\.html$/u, '$2');
      },
    },
  });
};
