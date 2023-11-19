// 从JSON树对象中筛选出深度为2的树
const _ = require('vtils');
const path = require('path');
const fs = require('fs');
function traverseObj(obj, childrenProp, level) {
  if (obj && obj[childrenProp] && level <= 0) {
    delete obj[childrenProp];
  } else if (obj && obj[childrenProp] && obj[childrenProp].length > 0) {
    obj[childrenProp].forEach(item => {
      traverseObj(item, childrenProp, level - 1);
    });
  } else if (_.isArray(obj)) {
    obj.forEach(item => {
      traverseObj(item, childrenProp, level - 1);
    });
  }
  return obj;
}
module.exports = function (args) {
  const { f, level, d } = args;
  const jsonData = require(path.join(process.cwd(), f));
  traverseObj(jsonData, 'children', level);
  fs.writeFileSync(d, JSON.stringify(jsonData));
};
