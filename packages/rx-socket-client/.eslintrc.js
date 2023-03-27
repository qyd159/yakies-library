module.exports = {
  root: true,
  env: {
    node: true,
  },
  globals: {},
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'import/no-webpack-loader-syntax': 'off',
    indent: 'off',
    'standard/no-callback-literal': 0,
    'spaced-comment': 'off',
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
};
