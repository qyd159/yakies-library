import path from 'path'
import fs from 'fs'
import jsdom from 'jsdom'
import os from 'os'
import colors from 'picocolors'
import { promises as dns } from 'node:dns'
import type { AddressInfo, Server } from 'node:net'

interface ResolvedServerUrls {
  local: string[]
  network: string[]
}

interface CommonServerOptions {
  /**
   * Specify server port. Note if the port is already being used, Vite will
   * automatically try the next available port so this may not be the actual
   * port the server ends up listening on.
   */
  port?: number
  /**
   * If enabled, vite will exit if specified port is already in use
   */
  strictPort?: boolean
  /**
   * Specify which IP addresses the server should listen on.
   * Set to 0.0.0.0 to listen on all addresses, including LAN and public addresses.
   */
  host?: string | boolean
  /**
   * Enable TLS + HTTP/2.
   * Note: this downgrades to TLS only when the proxy option is also used.
   */
  https?: boolean
  /**
   * Open browser window on startup
   */
}


const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();

const getAllFiles = function (root, ignoreDir, fileExt, options) {
  if (arguments.length === 3) {
    options = fileExt;
    fileExt = null;
  }

  if (options && typeof options.depth === 'undefined') {
    options.depth = 99999;
  } else if (options && options.depth === 0) {
    return [];
  } else {
    options = {
      depth: 99999
    };
  }
  options.depth -= 1;
  var res = [],
    files =
      options && options.cwd
        ? fs.readdirSync(path.join(options.cwd, root))
        : fs.readdirSync(root);
  files.forEach(function (file) {
    var pathname = root + '/' + file,
      stat = fs.lstatSync(
        options && options.cwd ? path.join(options.cwd, pathname) : pathname
      );

    if (
      (typeof ignoreDir === 'string' && file === ignoreDir) ||
      (Array.isArray(ignoreDir) && ignoreDir.indexOf(file) !== -1)
    ) {
      return;
    }
    const ext = path.parse(pathname).ext;
    if (
      fileExt &&
      !stat.isDirectory() &&
      (fileExt === ext || (fileExt instanceof RegExp && fileExt.test(ext)))
    ) {
      res.push({
        path: pathname,
        dir: false
      });
    }

    if (!fileExt && !stat.isDirectory()) {
      res.push({
        path: pathname,
        dir: false
      });
    } else if (stat.isDirectory()) {
      res.push({
        path: pathname,
        dir: true
      });
      res = res.concat(getAllFiles(pathname, [], fileExt, options));
    }
  });
  return res;
};

const insertLinkCss = function (document, $cssLoader, url) {
  var linkElm = document.createElement('link');
  linkElm.setAttribute('rel', 'stylesheet');
  linkElm.setAttribute('type', 'text/css');
  linkElm.setAttribute('href', url);
  $cssLoader.after(linkElm);
};

const insertScript = function (document, $jsLoader, url, $) {
  var scriptElm = document.createElement('script');
  scriptElm.setAttribute('type', 'text/javascript');
  scriptElm.setAttribute('src', url);
  $(scriptElm).insertBefore($jsLoader);
};

const getTemplateJs = function (proxy, wwwFileMap) {
  let fileMap = proxy;
  if (fileMap.js) {
    return fileMap.js;
  }

  var loaderTemplate = [],
    result;
  if (typeof fileMap.loaderTemplate === 'string') {
    loaderTemplate = [fileMap.loaderTemplate];
  } else if (Array.isArray(fileMap.loaderTemplate)) {
    loaderTemplate = fileMap.loaderTemplate;
  }

  loaderTemplate.some((item) => {
    if (
      wwwFileMap.templates[item] &&
      wwwFileMap.templates[item].js
    ) {
      result = wwwFileMap.templates[item].js;
    }
  })

  return result;
};

const getTemplateCss = function (proxy, wwwFileMap) {
  let fileMap = proxy;
  if (fileMap.css) {
    return fileMap.css;
  }

  var loaderTemplate = [],
    result;
  if (typeof fileMap.loaderTemplate === 'string') {
    loaderTemplate = [fileMap.loaderTemplate];
  } else if (Array.isArray(fileMap.loaderTemplate)) {
    loaderTemplate = fileMap.loaderTemplate;
  }

  loaderTemplate.some((item) => {
    if (
      wwwFileMap.templates[item] &&
      wwwFileMap.templates[item].css
    ) {
      result = wwwFileMap.templates[item].css;
    }
  })

  return result;
};

const handleHtml = function (result, gamesite, proxy) {
  const wwwFileMap = global.wwwFileMap;
  const dom = new JSDOM(result, { virtualConsole: virtualConsole });
  const window = dom.window;
  const $ = require('jquery')(window);

  let jsLoader = window.document.getElementById('jsLoader');
  let cssLoader = window.document.getElementById('cssLoader');

  !jsLoader && console.warn('您没有在模板里设置jsLoader');
  !cssLoader && console.warn('您没有在模板里设置cssLoader');

  if (
    proxy.jsRequires &&
    proxy.jsRequires.length > 0
  ) {
    const jsRequires = proxy.jsRequires;
    for (let i = 0; i < jsRequires.length; i++) {
      insertScript(
        window.document,
        $(jsLoader),
        '/' + path.join(gamesite, jsRequires[i]),
        $
      );
    }
  }

  const links = window.document.getElementsByTagName('link');
  const scripts = window.document.getElementsByTagName('script');

  //解决jquery 插入script的bug
  for (let i = 0; i < scripts.length; i++) {
    if (JSON.stringify(scripts[i]).indexOf('jQuery') !== -1) {
      $(scripts[i]).remove();
      i--;
    }
  }

  /**
   * 替换页面的部分链接css
   */

  if (!wwwFileMap.cssInjector) {
    wwwFileMap.cssInjector = [];
  }

  if (!proxy.cssInjector) {
    proxy.cssInjector = [];
  }

  let cssInjector = wwwFileMap.cssInjector;
  cssInjector = cssInjector.concat(proxy.cssInjector)

  Array.prototype.map.call(links, function (link) {
    /*替换本地开发用到的css*/
    const prefix = '//' + wwwFileMap.wwwDeployDomain + '/';
    const index = link.href && link.href.indexOf(prefix);
    if (link.href && index !== -1) {
      const filepath1 = link.href.substring(index + prefix.length);
      if (filepath1.indexOf(gamesite) === 0) {
        link.href = '/' + filepath1;
      }
    }

    if (cssInjector && Array.isArray(cssInjector) && cssInjector.length > 0) {
      for (let i = 0; i < cssInjector.length; i++) {
        if (link.href && link.href.indexOf(cssInjector[i].url) !== -1) {
          link.href = cssInjector[i].target;
        }
      }
    }
  });

  /**
   * 替换页面的部分js
   */

  if (!proxy.jsInjector) {
    proxy.jsInjector = [];
  }

  Array.prototype.map.apply(scripts, [
    function (script) {
      /**
       * 替换本地开发用到的js
       */
      const prefix = '//' + wwwFileMap.wwwDeployDomain + '/';
      const index = script.src && script.src.indexOf(prefix);
      if (script.src && index !== -1) {
        const filepath1 = script.src.substring(index + prefix.length);
        if (filepath1.indexOf(gamesite) === 0) {
          script.src = '/' + filepath1;
        }
      }

      if (proxy.jsInjector.length > 0) {
        for (let i = 0; i < proxy.jsInjector.length; i++) {
          if (script.src && script.src.indexOf(proxy.jsInjector[i].url) !== -1) {
            script.src = proxy.jsInjector[i].target;
          }
        }
      }
    }
  ]);

  const jsLoaderPath = getTemplateJs(proxy, wwwFileMap);
  const cssLoaderPath = getTemplateCss(proxy, wwwFileMap);

  jsLoaderPath &&
    jsLoader &&
    (jsLoader.src = '/' + path.join(gamesite, jsLoaderPath));
  cssLoaderPath &&
    cssLoader &&
    (cssLoader.href = '/' + path.join(gamesite, cssLoaderPath));

  /*注入新的css*/

  if (
    proxy.cssRequires &&
    proxy.cssRequires.length > 0
  ) {
    const cssRequires = proxy.cssRequires;
    for (const element of cssRequires) {
      insertLinkCss(
        window.document,
        $(cssLoader),
        '/' + path.join(gamesite, element),
      );
    }
  }

  /**
   * 替换img标签的源为本地服务器的文件
   */
  const images = window.document.getElementsByTagName('img');
  Array.prototype.map.call(images, function (image) {
    const prefix = '//' + wwwFileMap.wwwDeployDomain + '/';
    const index = image.src && image.src.indexOf(prefix);
    const $image = $(image);
    const data_src = $image.attr('data-src');
    const data_index = data_src && data_src.indexOf(prefix);

    if (image.src && index !== -1) {
      const filepath1 = image.src.substring(index + prefix.length);
      if (filepath1.indexOf(gamesite) === 0) {
        image.src = '/' + filepath1;
      }
    }

    if (data_src && data_index !== -1) {
      const filepath2 = data_src.substring(data_index + prefix.length);
      if (filepath2.indexOf(gamesite) === 0) {
        $image.attr('data-src', '/' + filepath2);
      }
    }
  });
  return dom.serialize();
};

/**
 * http://nodejs.cn/api/os/os_networkinterfaces.html
 */
const isIPV4 = (family: string | number) => {
  return family === 'IPv4' || family === 4
}

const getLocalV4Ips = () => {
  const interfaceDict = os.networkInterfaces()
  const addresses: string[] = []
  for (const key in interfaceDict) {
    const interfaces = interfaceDict[key]
    if (interfaces) {
      for (const item of interfaces) {
        if (isIPV4(item.family)) {
          addresses.push(item.address)
        }
      }
    }
  }

  return addresses
}

const getDefaultHosts = () => {
  return ['localhost', ...getLocalV4Ips()]
}

function printServerUrls(
  urls: ResolvedServerUrls,
  optionsHost: string | boolean | undefined,
): void {
  const colorUrl = (url: string) =>
    colors.cyan(url.replace(/:(\d+)\//, (_, port) => `:${colors.bold(port)}/`))
  for (const url of urls.local) {
    console.log(`  ${colors.green('➜')}  ${colors.bold('Local')}:   ${colorUrl(url)}`)
  }
  for (const url of urls.network) {
    console.log(`  ${colors.green('➜')}  ${colors.bold('Network')}: ${colorUrl(url)}`)
  }
  if (urls.network.length === 0 && optionsHost === undefined) {
    console.log(
      colors.dim(`  ${colors.green('➜')}  ${colors.bold('Network')}: use `) +
      colors.bold('--host') +
      colors.dim(' to expose'),
    )
  }
}

interface Hostname {
  /** undefined sets the default behaviour of server.listen */
  host: string | undefined
  /** resolve to localhost when possible */
  name: string
}

async function getLocalhostAddressIfDiffersFromDNS(): Promise<
  string | undefined
> {
  const [nodeResult, dnsResult] = await Promise.all([
    dns.lookup('localhost'),
    dns.lookup('localhost', { verbatim: true }),
  ])
  const isSame =
    nodeResult.family === dnsResult.family &&
    nodeResult.address === dnsResult.address
  return isSame ? undefined : nodeResult.address
}

const loopbackHosts = new Set([
  'localhost',
  '127.0.0.1',
  '::1',
  '0000:0000:0000:0000:0000:0000:0000:0001',
])

const wildcardHosts = new Set([
  '0.0.0.0',
  '::',
  '0000:0000:0000:0000:0000:0000:0000:0000',
])

async function resolveHostname(
  optionsHost: string | boolean | undefined,
): Promise<Hostname> {
  let host: string | undefined
  if (optionsHost === undefined || optionsHost === false) {
    // Use a secure default
    host = 'localhost'
  } else if (optionsHost === true) {
    // If passed --host in the CLI without arguments
    host = undefined // undefined typically means 0.0.0.0 or :: (listen on all IPs)
  } else {
    host = optionsHost
  }

  // Set host name to localhost when possible
  let name = host === undefined || wildcardHosts.has(host) ? 'localhost' : host

  if (host === 'localhost') {
    // See #8647 for more details.
    const localhostAddr = await getLocalhostAddressIfDiffersFromDNS()
    if (localhostAddr) {
      name = localhostAddr
    }
  }

  return { host, name }
}

async function resolveServerUrls(
  server: Server,
  options: CommonServerOptions,
  config: any = { rawBase: '' },
): Promise<ResolvedServerUrls> {
  const address = server.address()

  const isAddressInfo = (x: any): x is AddressInfo => x?.address
  if (!isAddressInfo(address)) {
    return { local: [], network: [] }
  }

  const local: string[] = []
  const network: string[] = []
  const hostname = await resolveHostname(options.host)
  const protocol = options.https ? 'https' : 'http'
  const port = address.port
  const base =
    config.rawBase === './' || config.rawBase === '' ? '/' : config.rawBase

  if (hostname.host && loopbackHosts.has(hostname.host)) {
    let hostnameName = hostname.name
    // ipv6 host
    if (hostnameName.includes(':')) {
      hostnameName = `[${hostnameName}]`
    }
    local.push(`${protocol}://${hostnameName}:${port}${base}`)
  } else {
    Object.values(os.networkInterfaces())
      .flatMap((nInterface) => nInterface ?? [])
      .filter(
        (detail) =>
          detail &&
          detail.address &&
          (detail.family === 'IPv4' ||
            // @ts-expect-error Node 18.0 - 18.3 returns number
            detail.family === 4),
      )
      .forEach((detail) => {
        let host = detail.address.replace('127.0.0.1', hostname.name)
        // ipv6 host
        if (host.includes(':')) {
          host = `[${host}]`
        }
        const url = `${protocol}://${host}:${port}${base}`
        if (detail.address.includes('127.0.0.1')) {
          local.push(url)
        } else {
          network.push(url)
        }
      })
  }
  return { local, network }
}

export {
  getAllFiles,
  insertLinkCss,
  insertScript,
  handleHtml,
  getDefaultHosts,
  printServerUrls,
  resolveServerUrls
};
