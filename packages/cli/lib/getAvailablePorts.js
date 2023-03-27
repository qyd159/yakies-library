var net = require('net');
var settings = require('../conf/settings');

//为了同时使用多个browserSync实例
function portIsOccupied(port, callback) {
// 创建服务并监听该端口
  var server = net.createServer().listen(port,'0.0.0.0');

  server.on('listening', function () { // 执行这块代码说明端口未被占用
    server.close();// 关闭服务
    var netSocket = net.createConnection(port,function(){
      portIsOccupied(port + 2, callback);
      netSocket.destroy();
    });

    netSocket.on('error',function(err){
      if(err.code === 'ECONNREFUSED'||err.code === 'ENOTFOUND'){
        callback && callback(port);
      }
    });
  });

  server.on('error', function (err) {
    if (err.code === 'EADDRINUSE') { // 端口已经被使用
      portIsOccupied(port + 2, callback);
    }
  })
}

// 检测端口是否被占用
module.exports = function (callback) {
  portIsOccupied(settings.browserSyncPort, function (port) {
    settings.browserSyncPort = port;
    process.env.browserSyncPort = port;
    callback && callback(port);
  });
};
