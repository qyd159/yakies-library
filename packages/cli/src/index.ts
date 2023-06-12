import createAppServer from './server/app';
import './common/bootstrap';
import watchFiles from './lib/watchFiles';
import creatProject from './create';
import loadConfig from './lib/loadConfig';

const path = require('path');
const portfinder = require('portfinder');
const { debounce, merge } = require('lodash');

export default async function (argv) {
  let user_path = argv._.length > 0 ? argv._[0] : '';
  argv.r = argv.root = user_path ? user_path : '.';

  /*根据ya默认配置来执行外部脚本*/
  if (argv._[0] === 'exec') {
    const widgets = require('./widgets');
    const mode = argv._[1];
    if (mode === 'list') {
      for (let widget in widgets) {
        console.log(widget);
      }
    } else {
      require(widgets[mode])(argv);
    }
    return;
  }

  /*通过模版建立项目 */
  if (argv._[0] === 'create') {
    creatProject();
    return;
  }

  // 下面是ya提供的开发代理服务器
  let [config, configFile] = await loadConfig(!!argv.dev);

  if (argv.bs) {
    // 预先获取browser-sync能够使用的端口号
    await new Promise((resolve, reject) => {
      portfinder.getPort({ port: config.browserSyncPort }, (err, port) => {
        if (err) {
          return reject(err);
        }
        config.browserSyncPort = port;
        resolve(null);
      });
    });
  }

  if (!argv.port) {
    // 预先获取内置服务器能够使用的端口号
    await new Promise(function (resolve, reject) {
      portfinder.getPort(config.port_range, (err, port) => {
        if (err) {
          return reject(err);
        }
        config.port = port;
        resolve(null);
      });
    });
  }

  global.YaConfig = merge({}, config);
  if (process.env.service) {
    const serviceConfig = JSON.parse(process.env.service);
    // electron命令模式，读取sevice环境变量
    global.YaConfig = merge(global.YaConfig, {
      httpProxy: JSON.parse(serviceConfig.httpProxy || '[]').concat([{ target: serviceConfig.target }]),
      useHttps: !!serviceConfig.https,
    });
  }

  const port = +argv.port || config.port;
  return await createAppServer(
    { port, root: argv.root, useHttps: global.YaConfig.useHttps || argv.https, hosts: argv.host?.split(',') ?? [] },
    () => {
      if (!argv.bs) return;
      console.warn('开启browser-sync可能会造成卡顿甚至阻塞，请谨慎使用！');
      const newPath = path.join(process.cwd(), argv.root);
      const browserSync = require('browser-sync').create();
      const bsConfig = {
        port: config.browserSyncPort,
        open: false,
        proxy: {
          target: 'http://' + config.dev_ip + ':' + port,
          ws: true,
        },
        files: [
          path.posix.join(newPath, '**/*.css'),
          path.posix.join(newPath, '**/*.png'),
          path.posix.join(newPath, '**/*.swf'),
          path.posix.join(newPath, '**/*.jpg'),
          path.posix.join(newPath, '**/*.gif'),
          {
            match: [path.posix.join(newPath, '**/*.js')],
            options: { ignored: ['.yarc.js', 'config.js'] },
          },
          path.posix.join(newPath, '**/*.html'),
        ],
        ignore: [path.posix.join(newPath, 'node_modules/**'), path.posix.join(newPath, '**/node_modules/**')],
        logFileChanges: true,
        logSnippet: false,
        /**
         * Can be either "info", "debug", "warn", or "silent"
         */
        logLevel: 'info',
      };
      if (argv.log) {
        Object.assign(bsConfig, {
          debug: true,
          logLevel: 'debug',
        });
      }
      browserSync.init(bsConfig, function (err) {
        if (err) {
          console.error(err);
          return;
        }

        // 监听配置文件config.js或者ya-conf.js
        var debounceFunc = debounce(async function () {
          var validate = true;
          try {
            config = await loadConfig(argv)[0];
            // 配置文件变更
          } catch (e) {
            validate = false;
            console.warn('.yarc.js配置文件语法错误，请检查');
          } finally {
            validate &&
              setTimeout(function () {
                browserSync.reload();
              }, 500);
          }
        }, 500);
        watchFiles(configFile, function (type) {
          if (type === 'change') {
            debounceFunc();
          }
        });
      });
    }
  );
}
