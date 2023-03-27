// https://www.babeljs.cn/docs/babel-register
const register = require('@babel/register').default;
register({
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    ignore: [
        // The file's path is passed to any ignore functions. It will
        // **not** be compiled if `true` is returned.
        function (filepath) {
            if (filepath.indexOf('node_modules') !== -1) {
                if (filepath.indexOf('js-combinatorics') !== -1) {
                    return false;
                }
                return true;
            }
            return false;
        },
    ],
});

// hijack lodash-es
const requireHijack = require('require-hijack');
requireHijack.replace('lodash-es').with(require('lodash'));
