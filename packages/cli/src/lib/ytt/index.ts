export const baseHandlers = (onlyMatchPath?) => ({
  preproccessInterface(_ii) {
    const ii = _ii;
    // ii.path += '_test'
    return onlyMatchPath ? (onlyMatchPath.test(ii.path) ? ii : false) : ii;
  },
  getRequestFunctionName(ii, cc) {
    const name = cc.camelCase((ii.parsedPath.dir + '/' + ii.parsedPath.name).replace(/\//g, ' '));
    return name || 'helloWorld';
  },
  getRequestDataTypeName(ii, cc) {
    const name = cc.pascalCase((ii.parsedPath.dir + '/' + ii.parsedPath.name).replace(/\//g, ' '));
    return `${name || 'HelloWorld'}Request`;
  },
  getResponseDataTypeName(ii, cc) {
    const name = cc.pascalCase((ii.parsedPath.dir + '/' + ii.parsedPath.name).replace(/\//g, ' '));
    return `${name || 'HelloWorld'}Response`;
  },
});
const getFuncName = (ii, cc, regexTrim?) => {
  let dir = ii.parsedPath.dir;
  if (dir?.match(regexTrim)) {
    const newdir = dir.replace(regexTrim, '');
    dir = newdir;
  }
  const name = cc.camelCase((dir + '/' + ii.parsedPath.name).replace(/\//g, ' ')) || 'helloWorld';
  switch (ii.method) {
    case 'POST':
      return `create${cc.pascalCase(name)}`;
    case 'PUT':
      return `update${cc.pascalCase(name)}`;
    case 'PATCH':
      return `patch${cc.pascalCase(name)}`;
    case 'GET':
      if (ii.query_path?.params.length === 0) return `list${cc.pascalCase(name)}`;
      return `fetch${cc.pascalCase(name)}`;
    case 'DELETE':
      if (ii.query_path?.params.length === 0) return `batchDel${cc.pascalCase(name)}`;
      return `del${cc.pascalCase(name)}`;
    default:
      return name;
  }
};
export const complicatedHandlers = (onlyMatchPath?, regexTrim?) => {
  // 需要去重
  const interfaces = new Map();
  return {
    preproccessInterface(_ii) {
      const uid = _ii.method + _ii.path;
      if (interfaces.get(uid)) {
        return false;
      } else {
        interfaces.set(uid, true);
      }
      const ii = _ii;
      // ii.path += '_test'
      return onlyMatchPath ? (onlyMatchPath.test(ii.path) ? ii : false) : ii;
    },
    getRequestFunctionName(ii, cc) {
      return getFuncName(ii, cc, regexTrim);
    },
    getRequestDataTypeName(ii, cc) {
      return cc.pascalCase(`${getFuncName(ii, cc, regexTrim)}Request`);
    },
    getResponseDataTypeName(ii, cc) {
      return cc.pascalCase(`${getFuncName(ii, cc, regexTrim)}Response`);
    },
  };
};
