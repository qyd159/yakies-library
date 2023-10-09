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
