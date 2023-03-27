const _ = require('../lib/util');
const fs = require('fs');
module.exports = function (args) {
  const files = _.getAllFiles('.');
  for (let index = 0; index < files.length; index++) {
    const element = files[index];
    if (element.isDir) continue;
    const decodedPath = decodeURIComponent(element.path);
    
    if (decodedPath.indexOf('?') !== -1) {
      let oldPath = element.path;
      let newPath = decodedPath.substring(0, decodedPath.indexOf('?'));
      fs.renameSync(oldPath, newPath);
    }

    if (decodedPath.indexOf('_1') !== -1) {
      let oldPath = element.path;
      let newPath = decodedPath.replace(/_1/g, '');
      fs.renameSync(oldPath, newPath);
    }

    if (decodedPath.indexOf(' ') !== -1) {
      let oldPath = element.path;
      let newPath = decodedPath.replace(/%20/g, ' ');
      fs.renameSync(oldPath, newPath);
    }

  }
}
