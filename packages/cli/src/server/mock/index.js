import * as _ from '../../lib/util';
const Crawler = require('crawler');
const bodyParser = require('body-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');
const proxyCacheMiddleware = require('@yakies/proxy-cache-middleware');
const Axios = require('axios').default;
const queryString = require('query-string');
const URL = require('url');
const { isArray } = require('lodash');
const { gzip, ungzip } = require('node-gzip');
const interfaceMonitorUrl = 'https://mock-manager.yakies.cn/monitor';
const YaConfig = global.YaConfig;
const c = new Crawler({
    maxConnections: 10,
    strictSSL: false,
    jar: true,
    // This will be called for each crawled page
    callback: function (error, res, done) {
        if (error) {
            console.log(error);
        }
        else {
            const $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
        }
        done();
    },
});
module.exports = async function (req, res, next) {
    const proxy_api = YaConfig.httpProxy?.some((item) => req.originalUrl.indexOf(item.baseApi) === 0);
    const proxy = proxy_api
        ? YaConfig.httpProxy?.find((item) => req.originalUrl.indexOf(item.baseApi) === 0)
        : YaConfig.httpProxy?.find((item) => !item.baseApi);
    let contextPath = './';
    if (proxy?.url?.indexOf('//') === 0) {
        proxy.url = 'http:' + proxy.url;
    }
    let result;
    if (proxy?.url && proxy.prepareUrl) {
        await new Promise((resolve) => {
            //需要先访问某页面后才能访问目标页面
            c.queue({
                uri: proxy.prepareUrl,
                // The global callback won't be called
                callback: function (error, grabedRes, done) {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        c.queue({
                            uri: proxy.url,
                            // The global callback won't be called
                            callback: function (error, grabedRes, done) {
                                if (error) {
                                    console.log(error);
                                }
                                else {
                                    resolve(grabedRes.body);
                                    done();
                                }
                            },
                        });
                        done();
                    }
                },
            });
        });
    }
    else if (proxy?.url) {
        result = await new Promise((resolve) => {
            c.queue({
                uri: proxy.url,
                // The global callback won't be called
                callback: function (error, grabedRes, done) {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        resolve(grabedRes.body);
                        done();
                    }
                },
            });
        });
    }
    else if (proxy) {
        const parsedUrl = URL.parse(req.originalUrl);
        const parsedTargetUrl = URL.parse(proxy.target);
        req.url = parsedTargetUrl.path + (parsedTargetUrl.search ? (parsedUrl.query ? '&' + parsedUrl.query : '') : parsedUrl.search || '');
        if (YaConfig.cache && (parsedUrl.pathname.endsWith('.css') || parsedUrl.pathname.endsWith('.js'))) {
            // 这里只适用静态资源缓存
            proxyCacheMiddleware({
                dir: YaConfig.proxyCacheDir || './tmp',
                defaultDomain: 'dev',
                domain: {
                    dev: proxy.target,
                },
            })(req, res, next);
            return;
        }
        if (!YaConfig.apiProxy && !YaConfig.pureProxy) {
            const options = {
                target: parsedTargetUrl.protocol + '//' + parsedTargetUrl.host + parsedTargetUrl.path,
                changeOrigin: true,
                // ws: true,
                selfHandleResponse: false,
                secure: false,
            };
            // options.onProxyRes = function (proxyRes, req, res) {
            //   proxyRes.headers['x-added'] = 'foobar' // add new header to response
            //   delete proxyRes.headers['x-removed'] // remove header from response
            // }
            YaConfig.pureProxy = createProxyMiddleware(options);
            YaConfig.apiProxy = (proxy, callback) => {
                const parsedTargetUrl = URL.parse(proxy.target);
                options.selfHandleResponse = true;
                options.target = parsedTargetUrl.protocol + '//' + parsedTargetUrl.host + parsedTargetUrl.path;
                options.onProxyRes = function (proxyRes, userReq) {
                    const bodyChunks = [];
                    proxyRes.on('data', (chunk) => {
                        bodyChunks.push(chunk);
                    });
                    proxyRes.on('end', () => {
                        const body = Buffer.concat(bodyChunks);
                        const data = {
                            statusCode: proxyRes.statusCode,
                            headers: proxyRes.headers,
                            body,
                        };
                        if (data.headers['content-type'] && data.headers['content-type'].indexOf('application/json') !== -1) {
                            data.body = body.toString();
                        }
                        callback(null, data);
                    });
                };
                return createProxyMiddleware(options);
            };
        }
        async function response(data) {
            // forwarding source status
            res.status(data.statusCode);
            // forwarding source headers1
            Object.keys(data.headers).forEach((key) => {
                res.append(key, data.headers[key]);
            });
            // modifying html content
            if (data.headers['content-type'] && data.headers['content-type'].includes('text/html') && data.statusCode === 200) {
                if (proxy.gziped || data.headers['content-encoding'] === 'gzip') {
                    let html = _.handleHtml(await ungzip(data.body), contextPath, proxy);
                    res.send(await gzip(html));
                }
                else {
                    res.send(_.handleHtml(data.body, contextPath, proxy));
                }
            }
            else {
                res.send(data.body);
            }
            res.end();
        }
        if (proxy && req.originalUrl.indexOf(proxy.baseApi) === 0) {
            // 是后台请求
            YaConfig.apiProxy(proxy, (err, data) => {
                if (!(data.body instanceof Buffer) && proxy.capture) {
                    const parsedUrl = URL.parse(req.originalUrl);
                    bodyParser.json()(req, res, next);
                    Axios.post(interfaceMonitorUrl, {
                        url: parsedUrl.pathname,
                        query: queryString.stringify(req.query),
                        method: req.method,
                        name: proxy.name,
                        desc: proxy.description,
                        body: JSON.stringify(req.body),
                        token: req.headers.authorization,
                        response: data.body,
                        user: 340,
                    }, {
                        responseType: 'json',
                        headers: {
                            Authorization: YaConfig.token,
                        },
                    }).then((res) => {
                        if (res.data.code !== 0) {
                        }
                    }, (err) => {
                        console.log(err);
                    });
                }
                response(data);
            })(req, res, next);
        }
        else if (
        // 表示浏览器的首次页面请求
        !req.xhr &&
            req.headers['sec-fetch-mode'] === 'navigate' &&
            req.headers['accept'].includes('text/html') &&
            req.method === 'GET') {
            YaConfig.apiProxy(proxy, (err, data) => {
                response(data);
            })(req, res, next);
            return;
        }
        else {
            YaConfig.pureProxy(req, res, next);
        }
        return;
    }
    else {
        // res.end('请检查ya-conf.js的配置');
        req.url = req.originalUrl;
        next();
        return;
    }
    res.end(_.handleHtml(result, contextPath, proxy));
};
