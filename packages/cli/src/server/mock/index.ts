import * as _ from '../../lib/util'
import settings from '../../conf/settings';
const path = require('path');
const Crawler = require('crawler');
const bodyParser = require('body-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');
const proxyCacheMiddleware = require('@yakies/proxy-cache-middleware');
const Axios = require('axios').default;
const queryString = require('query-string');
const URL = require('url');
const { merge, isArray } = require('lodash');
const { gzip, ungzip } = require('node-gzip');

// const interfaceMonitorUrl = 'http://localhost:3100/api/v1/monitor';
const interfaceMonitorUrl = 'https://yakies.tech/api/v1/monitor';

// @ts-ignore
const wwwFileMap = global.wwwFileMap;

const c = new Crawler({
  maxConnections: 10,
  strictSSL: false,
  jar: true,
  // This will be called for each crawled page
  callback: function (error, res, done) {
    if (error) {
      console.log(error);
    } else {
      const $ = res.$;
      // $ is Cheerio by default
      //a lean implementation of core jQuery designed specifically for the server
    }
    done();
  },
});

module.exports = async function (req, res, next) {
  // set custom header.
  // res.setHeader('xxxx', 'xxx');
  let type = req.originalUrl.substring(
    1,
    req.originalUrl.indexOf('?') !== -1
      ? req.originalUrl.indexOf('?')
      : req.originalUrl.length
  );

  if (type.indexOf('/') !== -1) {
    type = type.split('/')[0];
  }

  if (!type) {
    type = 'index';
  }

  let contextPath = './';
  let proxyMode = !!wwwFileMap.proxy;

  if (
    wwwFileMap[type] &&
    wwwFileMap[type].url &&
    wwwFileMap[type].url.indexOf('//') === 0
  ) {
    wwwFileMap[type].url = 'http:' + wwwFileMap[type].url;
  }

  let result;

  if (wwwFileMap[type] && wwwFileMap[type].url && wwwFileMap[type].prepareUrl) {
    await new Promise((resolve) => {
      //需要先访问某页面后才能访问目标页面
      c.queue({
        uri: wwwFileMap[type].prepareUrl,
        // The global callback won't be called
        callback: function (error, grabedRes, done) {
          if (error) {
            console.log(error);
          } else {
            c.queue({
              uri: wwwFileMap[type].url,
              // The global callback won't be called
              callback: function (error, grabedRes, done) {
                if (error) {
                  console.log(error);
                } else {
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
  } else if (wwwFileMap[type] && wwwFileMap[type].url) {
    result = await new Promise((resolve) => {
      c.queue({
        uri: wwwFileMap[type].url,
        // The global callback won't be called
        callback: function (error, grabedRes, done) {
          if (error) {
            console.log(error);
          } else {
            resolve(grabedRes.body);
            done();
          }
        },
      });
    });
  } else if ((wwwFileMap[type] && wwwFileMap[type].proxy) || proxyMode) {
    const parsedUrl = URL.parse(req.originalUrl);
    const parsedTargetUrl = URL.parse(
      proxyMode ? wwwFileMap.proxy.target : wwwFileMap[type].proxy.target
    );
    req.url =
      parsedTargetUrl.path +
      (parsedTargetUrl.search
        ? parsedUrl.query
          ? '&' + parsedUrl.query
          : ''
        : parsedUrl.search || '');
    if (
      (proxyMode
        ? proxyMode && wwwFileMap.proxy.cache
        : wwwFileMap[type].proxy.cache) &&
      (parsedUrl.pathname.endsWith('.css') ||
        parsedUrl.pathname.endsWith('.js'))
    ) {
      // 这里只适用静态资源缓存
      proxyCacheMiddleware({
        dir: settings.proxyCacheDir || './tmp',
        defaultDomain: 'dev',
        domain: {
          dev: proxyMode
            ? wwwFileMap.proxy.target
            : wwwFileMap[type].proxy.target,
        },
      })(req, res, next);
      return;
    }
    if (!wwwFileMap.apiProxy && !wwwFileMap.pureProxy) {
      const options: any = {
        target: parsedTargetUrl.protocol + '//' + parsedTargetUrl.host,
        changeOrigin: true,
        // ws: true,
        selfHandleResponse: false,
        secure: false
      };
      // options.onProxyRes = function (proxyRes, req, res) {
      //   proxyRes.headers['x-added'] = 'foobar' // add new header to response
      //   delete proxyRes.headers['x-removed'] // remove header from response
      // }
      wwwFileMap.pureProxy = createProxyMiddleware(options);
      wwwFileMap.apiProxy = function (callback) {
        options.selfHandleResponse = true;
        options.onProxyRes = function (proxyRes, userReq) {
          const bodyChunks = [];
          proxyRes.on('data', (chunk) => {
            bodyChunks.push(chunk);
          });
          proxyRes.on('end', () => {
            const body: any = Buffer.concat(bodyChunks);
            const data = {
              statusCode: proxyRes.statusCode,
              headers: proxyRes.headers,
              body,
            };
            if (
              data.headers['content-type'] &&
              data.headers['content-type'].indexOf('application/json') !== -1
            ) {
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
      if (
        data.headers['content-type'] &&
        data.headers['content-type'].includes('text/html') &&
        data.statusCode === 200
      ) {
        if ((proxyMode && wwwFileMap.proxy.gziped) || (wwwFileMap[type] && wwwFileMap[type].proxy && wwwFileMap[type].proxy.gziped)) {
          let html = _.handleHtml(
            await ungzip(data.body),
            contextPath,
            type,
            settings,
            proxyMode
          );
          res.send(await gzip(html));
        } else {
          res.send(_.handleHtml(
            data.body,
            contextPath,
            type,
            settings,
            proxyMode
          ));
        }
      } else {
        res.send(data.body);
      }
      res.end();
    }
    let baseApi = []
    if (typeof wwwFileMap.proxy.baseApi === 'string') {
      baseApi = [wwwFileMap.proxy.baseApi]
    } else if (isArray(wwwFileMap.proxy.baseApi)) {
      baseApi = wwwFileMap.proxy.baseApi
    }
    if (proxyMode && baseApi.some(api => req.originalUrl.indexOf(api) === 0)) {
      // 是后台请求
      wwwFileMap.apiProxy((err, data) => {
        if (!(data.body instanceof Buffer) && wwwFileMap.proxy.capture) {
          bodyParser.json()(req, res, next)
          Axios.post(
            interfaceMonitorUrl,
            {
              url: parsedUrl.pathname,
              query: queryString.stringify(req.query),
              method: req.method,
              name: wwwFileMap.proxy.name,
              desc: wwwFileMap.proxy.description,
              body: JSON.stringify(req.body),
              token: req.headers.authorization,
              response: data.body,
              user: 340,
            },
            {
              responseType: 'json',
            }
          ).then(
            (res) => {
              if (res.data.code !== 0) {
                console.log(res.data);
              }
            },
            (err) => {
              console.log(err);
            }
          );
        }
        response(data);
      })(req, res, next);
    } else if (
      // 表示浏览器的首次页面请求
      !req.xhr &&
      req.headers['sec-fetch-mode'] === 'navigate' &&
      req.headers['accept'].includes('text/html') &&
      req.method === 'GET'
    ) {
      wwwFileMap.apiProxy((err, data) => {
        response(data);
      })(req, res, next);
      return;
    } else {
      wwwFileMap.pureProxy(req, res, next);
    }
    return;
  } else {
    // res.end('请检查ya-conf.js的配置');
    req.url = req.originalUrl;
    next();
    return;
  }
  res.end(_.handleHtml(result, contextPath, type, settings));
};
