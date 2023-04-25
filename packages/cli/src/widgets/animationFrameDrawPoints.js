const gm = require("gm").subClass({
  imageMagick: true
});
const fs = require("fs");
const _ = require("../lib/util");
const path = require("path");
module.exports = function(args) {
  let { width, height, prefix } = args;
  typeof prefix === "undefined" && (prefix = "");
  const files = _.getAllFiles(".", [], ".png", { depth: 1 });
  files.forEach(function(item) {
    if (!item.dir) {
      var fileInfo = path.parse(item.path);
      if (!fs.existsSync("./output")) {
        fs.mkdirSync("output");
      }
      if (item.path.indexOf(".png.png") !== -1) {
        console.log(item.path.substring(0, item.path.lastIndexOf(".png")));
        fs.renameSync(
          item.path,
          item.path.substring(0, item.path.lastIndexOf(".png"))
        );
        item.path = item.path.substring(0, item.path.lastIndexOf(".png"));
      }
      var outPutPath = path.join("output", fileInfo.dir,prefix+fileInfo.base);``
      gm(item.path).gravity('Center').background('none').extent(width, height, '!').fill("#ffffffbb").drawPoint(0,0).drawPoint(width-1,0).drawPoint(0,height-1).drawPoint(width-1,height-1).write(outPutPath, function (err) {
        if (err) return console.dir(arguments)
        console.log(this.outname + " created  ::  " + arguments[3])
      });
    }
  });
};
