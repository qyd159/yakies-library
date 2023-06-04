import createAppServer from './server/app';
import './common/bootstrap'
import settings from './conf/settings';
import watchFiles from './lib/watchFiles';
import creatProject from './create';

const Liftoff = require('liftoff');
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
    creatProject()
    return;
  }

  // 下面是ya提供的开发代理服务器

  //读取settings.js配置文件
  await new Promise((resolve) => {
    require('walk-up')(process.cwd(), 'settings.js', (err, result) => {
      if (result && result.found) {
        merge(settings, require(path.join(result.path, 'settings')));
      }
      resolve(null);
    });
  });

  if (argv.bs) {
    // 预先获取browser-sync能够使用的端口号
    await new Promise((resolve, reject) => {
      portfinder.getPort(settings.browserSyncPort, (err, port) => {
        if (err) {
          return reject(err);
        }
        // @ts-ignore
        settings.browserSyncPort = port;
        resolve(null);
      });
    });
  }

  if (!argv.port) {
    // 预先获取内置服务器能够使用的端口号
    await new Promise(function (resolve, reject) {
      portfinder.getPort(settings.port, (err, port) => {
        if (err) {
          return reject(err);
        }
        // @ts-ignore
        settings.port = port;
        resolve(null);
      });
    });
  }

  // 配置文件查找和解析
  let configFile: string = await new Promise((resolve) => {
    new Liftoff({
      name: 'ya', // 命令名字
      processTitle: 'ya',
      moduleName: 'ya',
      configFiles: {
        'ya-conf': {
          up: {
            path: '.',
            findUp: true,
            extensions: {
              '.js': null,
            },
          },
        },
        config: {
          cwd: {
            path: '.',
            findUp: true,
            extensions: {
              '.js': null,
            },
          },
        },
      },
    }).launch(
      {
        cwd: argv.r || argv.root,
        configPath: argv.f || argv.file,
      },
      function (env) {
        const configFile =
          env.configFiles['config'].cwd || env.configFiles['ya-conf'].up;
        if (!env.configPath && configFile) {
          env.configPath = configFile;
          require(env.configPath);
        }
        resolve(configFile);
      }
    );
  });
  if (process.env.service) {
    // electron命令模式，读取sevice环境变量
    // @ts-ignore
    global.wwwFileMap = merge(global.wwwFileMap, {
      proxy: JSON.parse(process.env.service),
    });
  }

  const port = +argv.port || settings.port;
  createAppServer({ port, root: argv.root, useHttps: argv.https, hosts: argv.host?.split(',') ?? [] }, () => {
    if (!argv.bs) return;
    console.warn('开启browser-sync可能会造成卡顿甚至阻塞，请谨慎使用！');
    const newPath = path.join(process.cwd(), argv.root);
    const browserSync = require('browser-sync').create();
    const bsConfig = {
      port: settings.browserSyncPort,
      open: false,
      proxy: {
        target: 'http://' + settings.dev_ip + ':' + port,
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
          options: { ignored: ['ya-conf.js', 'config.js'] },
        },
        path.posix.join(newPath, '**/*.html'),
      ],
      ignore: [
        path.posix.join(newPath, 'node_modules/**'),
        path.posix.join(newPath, '**/node_modules/**'),
      ],
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
      if (configFile) {
        var debounceFunc = debounce(function () {
          delete require.cache[configFile];
          var validate = true;
          try {
            require(configFile);
            // 配置文件变更
          } catch (e) {
            validate = false;
            console.warn('ya-conf.js配置文件语法错误，请检查');
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
      }
    });
  });
};
