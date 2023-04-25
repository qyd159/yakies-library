var base64Img = require('base64-img'); // ES5
var fs = require('fs');
module.exports = function (args) {
  /* var url = 'http://../demo.png';
  base64Img.requestBase64(url, function(err, res, body) {
  }); */
  // <!-- 1像素透明 -->
  // <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">

  // <!-- 1像素黑色 -->
  // <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=">
  base64Img.base64(args.f, function (err, data) {
    console.log(data);
    if (args.out) {
      fs.writeFileSync(args.out, data);
    }
  });
};
