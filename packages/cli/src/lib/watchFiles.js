var chokidar = require('chokidar');
export default function (dirPath, onChange) {
  chokidar.watch(dirPath, {ignored: /[\/\\]\./}).on('all', (event, path) => {
    onChange && onChange(event,path);
  });
};
