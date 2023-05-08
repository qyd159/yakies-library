import path from 'path'
import fs from 'fs'
import jsdom from 'jsdom'

const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();

const getAllFiles = function(root, ignoreDir, fileExt, options) {
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
  files.forEach(function(file) {
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

    if (
      fileExt &&
      !stat.isDirectory() &&
      fileExt === path.parse(pathname).ext
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

const insertLinkCss = function(document, $cssLoader, url) {
  var linkElm = document.createElement('link');
  linkElm.setAttribute('rel', 'stylesheet');
  linkElm.setAttribute('type', 'text/css');
  linkElm.setAttribute('href', url);
  $cssLoader.after(linkElm);
};

const insertScript = function(document, $jsLoader, url, $) {
  var scriptElm = document.createElement('script');
  scriptElm.setAttribute('type', 'text/javascript');
  scriptElm.setAttribute('src', url);
  $(scriptElm).insertBefore($jsLoader);
};

const getTemplateJs = function(type, wwwFileMap, proxyMode) {
  let fileMap = proxyMode ? wwwFileMap : wwwFileMap[type];
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

  for (var i = 0; i < loaderTemplate.length; i++) {
    if (
      wwwFileMap.templates[loaderTemplate[i]] &&
      wwwFileMap.templates[loaderTemplate[i]].js
    ) {
      result = wwwFileMap.templates[loaderTemplate[i]].js;
      break;
    }
  }

  return result;
};

const getTemplateCss = function(type, wwwFileMap, proxyMode) {
  let fileMap = proxyMode ? wwwFileMap : wwwFileMap[type];
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

  for (var i = 0; i < loaderTemplate.length; i++) {
    if (
      wwwFileMap.templates[loaderTemplate[i]] &&
      wwwFileMap.templates[loaderTemplate[i]].css
    ) {
      result = wwwFileMap.templates[loaderTemplate[i]].css;
      break;
    }
  }

  return result;
};

const handleHtml = function(result, gamesite, type, settings, proxyMode) {
  // @ts-ignore
  const wwwFileMap = global.wwwFileMap;
  const dom = new JSDOM(result, { virtualConsole: virtualConsole });
  const window = dom.window;
  const $ = require('jquery')(window);

  let jsLoader = window.document.getElementById('jsLoader');
  let cssLoader = window.document.getElementById('cssLoader');

  !jsLoader && console.warn('您没有在模板里设置jsLoader');
  !cssLoader && console.warn('您没有在模板里设置cssLoader');

  if (
    !proxyMode &&
    wwwFileMap[type].jsRequires &&
    wwwFileMap[type].jsRequires.length > 0
  ) {
    const jsRequires = wwwFileMap[type].jsRequires;
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

  if (!proxyMode && !wwwFileMap[type].cssInjector) {
    wwwFileMap[type].cssInjector = [];
  }

  let cssInjector = wwwFileMap.cssInjector;
  if (!proxyMode) {
    cssInjector = cssInjector.concat(wwwFileMap[type].cssInjector);
  }

  Array.prototype.map.call(links, function(link) {
    /*替换本地开发用到的css*/
    const prefix = '//' + settings.wwwDeployDomain + '/';
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

  if (!wwwFileMap.jsInjector) {
    wwwFileMap.jsInjector = [];
  }

  if (!proxyMode && !wwwFileMap[type].jsInjector) {
    wwwFileMap[type].jsInjector = [];
  }
  let jsInjector = wwwFileMap.jsInjector;

  if (!proxyMode) {
    jsInjector = jsInjector.concat(wwwFileMap[type].jsInjector);
  }

  Array.prototype.map.apply(scripts, [
    function(script) {
      /**
       * 替换本地开发用到的js
       */
      const prefix = '//' + settings.wwwDeployDomain + '/';
      const index = script.src && script.src.indexOf(prefix);
      if (script.src && index !== -1) {
        const filepath1 = script.src.substring(index + prefix.length);
        if (filepath1.indexOf(gamesite) === 0) {
          script.src = '/' + filepath1;
        }
      }

      if (jsInjector && Array.isArray(jsInjector) && jsInjector.length > 0) {
        for (let i = 0; i < jsInjector.length; i++) {
          if (script.src && script.src.indexOf(jsInjector[i].url) !== -1) {
            script.src = jsInjector[i].target;
          }
        }
      }
    }
  ]);

  const jsLoaderPath = getTemplateJs(type, wwwFileMap, proxyMode);
  const cssLoaderPath = getTemplateCss(type, wwwFileMap, proxyMode);

  jsLoaderPath &&
    jsLoader &&
    (jsLoader.src = '/' + path.join(gamesite, jsLoaderPath));
  cssLoaderPath &&
    cssLoader &&
    (cssLoader.href = '/' + path.join(gamesite, cssLoaderPath));

  /*注入新的css*/

  if (
    !proxyMode &&
    wwwFileMap[type].cssRequires &&
    wwwFileMap[type].cssRequires.length > 0
  ) {
    const cssRequires = wwwFileMap[type].cssRequires;
    for (let i = 0; i < cssRequires.length; i++) {
      insertLinkCss(
        window.document,
        $(cssLoader),
        '/' + path.join(gamesite, cssRequires[i]),
        $
      );
    }
  }

  /**
   * 替换img标签的源为本地服务器的文件
   */
  const images = window.document.getElementsByTagName('img');
  Array.prototype.map.call(images, function(image) {
    const prefix = '//' + settings.wwwDeployDomain + '/';
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

export {
  getAllFiles,
  insertLinkCss,
  insertScript,
  handleHtml
};
