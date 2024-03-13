const { pathsToModuleNameMapper } = require('ts-jest');
const readjson = require('readjson');
const tsconfigpath = './tsconfig.json'
const { compilerOptions } = readjson.sync(tsconfigpath);

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // testRegex: '(/(apps|libs)/(chatgpt-stateless)/.*(\\.|/)(test|spec))\\.[jt]sx?$',
  // testNamePattern: '查看并创建智聊AI运营系统账户',
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: tsconfigpath,
    }],
    'nvexeca\\\\.+\\.js': 'babel-jest',
    'get-node\\\\.+\\.js': 'babel-jest',
    'fetch-node-website\\\\.+\\.js': 'babel-jest',
    'colors-option\\\\.+\\.js': 'babel-jest',
    'is-plain-obj\\\\.+\\.js': 'babel-jest',
    'path-key\\\\.+\\.js': 'babel-jest',
    'global-cache-dir\\\\.+\\.js': 'babel-jest',
    'node-version-alias\\\\.+\\.js': 'babel-jest',
    'normalize-node-version\\\\.+\\.js': 'babel-jest',
    'all-node-versions\\\\.+\\.js': 'babel-jest',
    'preferred-node-version\\\\.+\\.js': 'babel-jest',
    'path-type\\\\.+\\.js': 'babel-jest',
    'lodash-es\\\\.+\\.js': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/.pnpm/(?!(nvexeca|get-node|fetch-node-website|colors-option|is-plain-obj|path-key|global-cache-dir|node-version-alias|normalize-node-version|all-node-versions|preferred-node-version|path-type|lodash-es))',
  ],
  // moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
  //   prefix: '<rootDir>/',
  // }),
};
