const ts = require('typescript');
const fs = require("fs")
const vm = require("vm");

function transpileModule(tsFile, compilerOptions) {
    const code = fs.readFileSync(tsFile, 'utf8')
    let result = ts.transpileModule(code, { compilerOptions });
    // 创建一个新的虚拟 JavaScript 环境，并在其中运行代码
    const script = new vm.Script(result.outputText);
    const context = vm.createContext({ require, exports: {} });
    script.runInContext(context);

    // 从虚拟环境中获取导出的内容
    const exported = context.exports;
    return exported.default
}

module.exports = function (tsFile) {
    return transpileModule(tsFile, { module: ts.ModuleKind.CommonJS });
}
