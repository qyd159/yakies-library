import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import devtool from '../devtool';

const express = require('express');
const url = require('url');
const path = require('path');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const sslify = require('express-sslify');
const selfsigned = require('selfsigned');

var app = express();

export default function ({ port, root, useHttps = false }, callback) {
  let server
  if (useHttps) {
    // 使用 express-sslify 强制 HTTPS 连接
    app.use(sslify.HTTPS());
    // 使用 selfsigned 生成自签名证书
    const attrs = [{ name: 'commonName', value: 'localhost' }];
    const pems = selfsigned.generate(attrs, { days: 365 });

    // 创建 HTTPS 服务器
    server = require('https').createServer(
      { key: pems.private, cert: pems.cert },
      app
    );

  } else {
    server = require('http').createServer(app);
  }
  // @ts-ignore
  let wwwFileMap = global.wwwFileMap || {};
  let wsProxy;
  const proxyOptions: Options = {
    changeOrigin: true,
    logLevel: 'debug',
    secure: false,
  };
  if (wwwFileMap && wwwFileMap.socket) {
    if (Array.isArray(wwwFileMap.socket)) {
      wsProxy = wwwFileMap.socket.map((socket) => {
        proxyOptions.target = socket.target;
        const wsProxyMiddlware = createProxyMiddleware(
          socket.path,
          proxyOptions
        );
        app.use(wsProxyMiddlware);
        return wsProxyMiddlware;
      });
    } else {
      proxyOptions.target = wwwFileMap.socket.target;
      wsProxy = createProxyMiddleware(wwwFileMap.socket.path, proxyOptions);
      app.use(wsProxy);
    }
  }

  const cwd = process.cwd();
  var yog_conf = {
    rewrite_file: [path.join(__dirname, 'mock', 'server.conf')],
    data_path: [path.join(__dirname, 'mock')],
    proxy_mode: false
  };

  yog_conf.rewrite_file.push(
    path.join(cwd, 'mock', 'server.conf'),
    path.join(cwd, 'config', 'server.conf'),
  );

  yog_conf.data_path.push(path.join(cwd, 'mock'));

  // @ts-ignore
  if (!global.wwwFileMap) {
    // @ts-ignore
    global.wwwFileMap = {};
  }
  yog_conf.proxy_mode = wwwFileMap && !!wwwFileMap.proxy;

  if (process.env.NODE_ENV !== 'development') {
    app.use(compression());
  }

  app.use(function (req, res, next) {
    const mockSettings = wwwFileMap.mockSettings;
    if (mockSettings) {
      const item = mockSettings.find((item) => {
        return req.url.indexOf(item.url) !== -1 && req.method === item.method;
      });
      if (item) {
        res.json(JSON.parse(item.response));
        return;
      }
    }
    next();
  });

  // logger
  app.use(require('morgan')('combined'));

  // server.conf 功能
  // 支持 test/ 目录下面 .js js 脚本功能和 json 预览功能。
  // 注意这里面的.js，不是一般的.js 文件，而是相当于 express 的 route.

  app.use(devtool(yog_conf));

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));

  // parse application/json
  app.use(bodyParser.json());

  app.use(cors());
  // 静态文件输出
  app.use(
    express.static(root ? path.join(cwd, root) : cwd, {
      index: ['index.html', 'index.htm', 'default.html', 'default.htm'],
      extensions: ['html', 'htm'],
      setHeaders: (res, path, stat) => {
        if (/.*\.(eot|ttf|ttc|otf|eot|woff|woff2|svg)(.*)/.test(path)) {
          res.setHeader('Access-Control-Allow-Origin', '*');
        }
      },
    })
  );

  // 静态文件列表。
  app.use(
    (function () {
      return function (req, res, next) {
        var pathname = url.parse(req.url).pathname;
        var fullpath = path.join(cwd, pathname);

        if (/\/$/.test(pathname) && fs.existsSync(fullpath)) {
          var stat = fs.statSync(fullpath);

          if (stat.isDirectory()) {
            var html = '';

            var files = fs.readdirSync(fullpath);

            html = '<!doctype html>';
            html += '<html>';
            html += '<head>';
            html += '<title>' + pathname + '</title>';
            html += '</head>';
            html += '<body>';
            html += '<h1> - ' + pathname + '</h1>';
            html += '<div id="file-list">';
            html += '<ul>';

            if (pathname !== '/') {
              html += '<li><a href="' + pathname + '..">..</a></li>';
            }

            files.forEach(function (item) {
              var s_url = path.join(pathname, item);
              html += '<li><a href="' + s_url + '">' + item + '</a></li>';
            });

            html += '</ul>';
            html += '</div>';
            html += '</body>';
            html += '</html>';

            res.send(html);
            return;
          }
        }

        next();
      };
    })()
  );

  // utf8 support
  app.use(function (req, res, next) {
    // attach utf-8 encoding header to text files.
    if (/\.(?:js|json|text|css)$/i.test(req.path)) {
      res.charset = 'utf-8';
    }
    next();
  });

  // 错误捕获。
  app.use(function (err, req, res, next) {
    console.log(err);
  });

  // Bind to a port
  var fs = require('fs');


  server.listen(port, '0.0.0.0', function () {
    console.log(' Listening on http://127.0.0.1:%d', port);
    callback();
  });

  if (Array.isArray(wsProxy)) {
    wsProxy.forEach((wsProxyMiddlware) => {
      server.on('upgrade', wsProxyMiddlware.upgrade); // <-- subscribe to http 'upgrade'
    });
  } else if (wsProxy) {
    server.on('upgrade', wsProxy.upgrade); // <-- subscribe to http 'upgrade'
  }

  // 在接收到关闭信号的时候，关闭所有的 socket 连接。
  (function () {
    var sockets = [];

    server.on('connection', function (socket) {
      sockets.push(socket);

      socket.on('close', function () {
        var idx = sockets.indexOf(socket);
        ~idx && sockets.splice(idx, 1);
      });
    });

    var finalize = function () {
      // Disconnect from cluster master
      process.disconnect && process.disconnect();
      process.exit(0);
    };

    // 关掉服务。
    process.on('SIGTERM', function () {
      console.log(' Recive quit signal in worker %s.', process.pid);
      sockets.length
        ? sockets.forEach(function (socket) {
          socket.destroy();
          finalize();
        })
        : server.close(finalize);
    });
  })();
};