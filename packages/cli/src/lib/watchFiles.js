var chokidar = require('chokidar');
module.exports = function (dirPath, onChange) {
  chokidar.watch(dirPath, {ignored: /[\/\\]\./}).on('all', (event, path) => {
    onChange && onChange(event,path);
  });
};
