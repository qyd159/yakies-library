const _ = require("../lib/util");
module.exports = function(args){
  const files = _.getAllFiles(".", [], ".js", {
    depth: 10
  });
  for (let index = 0; index < files.length; index++) {
      const file = files[index];
      if(!file.dir){
          console.log(file.path);
          /* 待完善 */
      }
  }
}