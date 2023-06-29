import { createProxyMiddleware } from 'http-proxy-middleware';
import devtool from '../devtool';
import { getDefaultHosts, printServerUrls, resolveServerUrls } from '../lib/util';
import { createLogger } from 'vite';
import express from 'express';
const url = require('url');
const path = require('path');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const app = express();
const Mkcert = require('@yakies/mkcert').default;
export default async function ({ port, root, useHttps = false, logLevel = 'info', hosts = [] }, callback) {
    let server;
    const allHosts = [...getDefaultHosts(), ...hosts];
    const uniqueHosts = Array.from(new Set(allHosts)).filter((item) => !!item);
    if (useHttps) {
        const mkcert = Mkcert.create({
            logger: createLogger(logLevel, {
                prefix: 'cli:mkcert',
            }),
            source: 'coding',
        });
        const certificate = await mkcert.install(uniqueHosts);
        // 创建 HTTPS 服务器
        server = require('https').createServer({ key: certificate.key && Buffer.from(certificate.key), cert: certificate.cert && Buffer.from(certificate.cert) }, app);
    }
    else {
        server = require('http').createServer(app);
    }
    let YaConfig = global.YaConfig || {};
    let wsProxy;
    const proxyOptions = {
        changeOrigin: true,
        logLevel: 'debug',
        secure: false,
    };
    if (YaConfig?.socket) {
        if (Array.isArray(YaConfig.socket)) {
            wsProxy = YaConfig.socket.map((socket) => {
                proxyOptions.target = socket.target;
                const wsProxyMiddlware = createProxyMiddleware(socket.path, proxyOptions);
                app.use(wsProxyMiddlware);
                return wsProxyMiddlware;
            });
        }
        else {
            proxyOptions.target = YaConfig.socket.target;
            wsProxy = createProxyMiddleware(YaConfig.socket.path, proxyOptions);
            app.use(wsProxy);
        }
    }
    const cwd = process.cwd();
    const yog_conf = {
        rewrite_file: [path.join(__dirname, 'mock', 'server.conf')],
        data_path: [path.join(__dirname, 'mock')],
        proxy_mode: false,
    };
    yog_conf.rewrite_file.push(path.join(cwd, 'mock', 'server.conf'), path.join(cwd, 'config', 'server.conf'));
    yog_conf.data_path.push(path.join(cwd, 'mock'));
    if (!global.YaConfig) {
        global.YaConfig = {};
    }
    yog_conf.proxy_mode = YaConfig?.httpProxy?.length > 0;
    if (process.env.NODE_ENV !== 'development') {
        app.use(compression());
    }
    app.use(function (req, res, next) {
        const mockSettings = YaConfig.mockSettings;
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
    app.use(express.static(root ? path.join(cwd, root) : cwd, {
        index: ['index.html', 'index.htm', 'default.html', 'default.htm'],
        extensions: ['html', 'htm'],
        setHeaders: (res, path, stat) => {
            if (/.*\.(eot|ttf|ttc|otf|eot|woff|woff2|svg)(.*)/.test(path)) {
                res.setHeader('Access-Control-Allow-Origin', '*');
            }
        },
    }));
    // 静态文件列表。
    app.use((function () {
        return function (req, res, next) {
            var pathname = decodeURIComponent(url.parse(req.url).pathname);
            var fullpath = path.join(cwd, root, pathname);
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
    })());
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
    const fs = require('fs');
    // Bind to a port
    server.listen(port, '0.0.0.0', async function () {
        printServerUrls(await resolveServerUrls(server, { host: '0.0.0.0', port: port, https: useHttps }), false);
        callback();
    });
    if (Array.isArray(wsProxy)) {
        wsProxy.forEach((wsProxyMiddlware) => {
            server.on('upgrade', wsProxyMiddlware.upgrade); // <-- subscribe to http 'upgrade'
        });
    }
    else if (wsProxy) {
        server.on('upgrade', wsProxy.upgrade); // <-- subscribe to http 'upgrade'
    }
    // 在接收到关闭信号的时候，关闭所有的 socket 连接。
    (function () {
        const sockets = [];
        server.on('connection', function (socket) {
            sockets.push(socket);
            socket.on('close', function () {
                const idx = sockets.indexOf(socket);
                ~idx && sockets.splice(idx, 1);
            });
        });
        const finalize = function () {
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
}
