module.exports = function(filePath,callback){
  //File System
  var fs = require('fs');
  var _ = require('underscore');
//fd is the file descriptor used by the WriteStream.
  var logFd;

//读取过程需要的
  var buf,
    logSize,
    start = 0,
    length,
    offse = 0,
    logArr = '',
    LENGHT = 1024 * 1024;//每次读取的长度，1M

//读取文件信息，获取文件长度
  fs.stat(filePath, function (err, stats) {
    if (err) throw err;
    logSize = stats.size;
    //打开文件,rs+避免缓存
    fs.open(filePath, 'rs+', 666, function (err, fd) {
      if (err) throw err;
      logFd = fd;
      length = LENGHT < (logSize - offse) ? LENGHT : (logSize - offse);
      buf = new Buffer(length);
      //日志读取
      readLog();
    });
  });
//日志读取
  function readLog() {
    //读取
    fs.readFile(filePath, {
      flag:'rs+'
    }, function (err,buf) {
      if (err) throw err;

      //按行切分
      var content = buf.toString('utf8');
      content = content.replace(/\n/g, ';');
      content=  content.replace(/\s+/g,'');
      logArr = content.split(';');
      i = logArr.length-1
      while(i>0){
        if(logArr[i] === ''){
          logArr.splice(i,1)
        }
        i--;
      }
      // logArr.splice(logArr.length-1);
      callback && callback(logArr);
    });
  }
};
