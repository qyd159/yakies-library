import path from 'path'
import fs from 'fs';

export const getAllFiles = function (root, ignoreDir, fileExt, options) {
  if (arguments.length === 3) {
    options = fileExt;
    fileExt = null;
  }

  if (options && typeof options.depth === 'undefined') {
    options.depth = 99999;
  } else if (options && options.depth === 0) {
    return [];
  } else {
    options = {
      depth: 99999
    };
  }
  options.depth -= 1;
  var res = [],
    files =
      options && options.cwd
        ? fs.readdirSync(path.join(options.cwd, root))
        : fs.readdirSync(root);
  files.forEach(function(file) {
    var pathname = root + '/' + file,
      stat = fs.lstatSync(
        options && options.cwd ? path.join(options.cwd, pathname) : pathname
      );

    if (
      (typeof ignoreDir === 'string' && file === ignoreDir) ||
      (Array.isArray(ignoreDir) && ignoreDir.indexOf(file) !== -1)
    ) {
      return;
    }

    if (
      fileExt &&
      !stat.isDirectory() &&
      fileExt === path.parse(pathname).ext
    ) {
      res.push({
        path: pathname,
        dir: false
      });
    }

    if (!fileExt && !stat.isDirectory()) {
      res.push({
        path: pathname,
        dir: false
      });
    } else if (stat.isDirectory()) {
      res.push({
        path: pathname,
        dir: true
      });
      res = res.concat(getAllFiles(pathname, [], fileExt, options));
    }
  });
  return res;
};
