/*
 * @Author: qinyadong
 * @Date: 2022-02-11 16:24:04
 * @LastEditTime: 2022-02-11 17:15:06
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \yakies\packages\cli\widgets\node-abi.js
 */

const nodeAbi = require('node-abi');

module.exports = function (args) {
  args.target = args.target || 'node';
  if (/^\d+$/.test(args.v) && +args.v > 40) {
    console.log(nodeAbi.getTarget(argv.v, args.target));
  } else if (/^\d+\./.test(args.v)) {
    console.log(nodeAbi.getAbi('7.2.0', 'node'));
  } else {
    console.log(nodeAbi.allTargets);
  }
};
