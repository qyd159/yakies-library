var net = require('net');
var settings = require('../conf/settings');
var _ = require('./util');

if (_.isArray(settings.port)) {

} else if (_.isNumber(settings.port) || _.isString(settings.port)) {
  settings.port = [+settings.port]
}

if (_.isArray(settings.port2)) {

} else if (_.isNumber(settings.port2) || _.isString(settings.port2)) {
  settings.port2 = [+settings.port2]
}

//为了同时使用多个browserSync实例
function portIsOccupied(portsArray, index, callback) {
// 创建服务并监听该端口
  var server = net.createServer().listen(portsArray[index], '0.0.0.0');
  server.on('listening', function () { // 执行这块代码说明端口未被占用
    server.close();// 关闭服务
    var netSocket = net.createConnection(portsArray[index],function(){
      portIsOccupied(portsArray, index + 1, callback);
      netSocket.destroy();
    });

    netSocket.on('error',function(err){
      if(err.code === 'ECONNREFUSED'||err.code === 'ENOTFOUND'){
        callback && callback(portsArray[index]);
      }
    });
  });

  server.on('error', function (err) {
    if (err.code === 'EADDRINUSE') { // 端口已经被使用
      if ((index + 1) < portsArray.length) {
        portIsOccupied(portsArray, index + 1, callback);
      } else {
        console.error("您配置的端口已经被占用，通过-p参数指定额外的端口，或者您也可以在settings.js里面添加额外的端口");
      }
    }
  })
}

// 检测端口是否被占用
module.exports = {
  port: function (callback) {
    portIsOccupied(settings.port, 0, function (port) {
      settings.port = port;
      callback && callback(port);
    });
  },
  port2: function (callback) {
    portIsOccupied(settings.port2, 0, function (port2) {
      settings.port2 = port2;
      callback && callback(port2);
    });
  },
  port3: function (callback) {
    portIsOccupied(settings.debugPorts, 0, function (debugPort) {
      settings.debugPort = debugPort;
      callback && callback(debugPort);
    });
  }
};
