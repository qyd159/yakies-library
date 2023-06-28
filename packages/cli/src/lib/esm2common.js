const babel = require("@babel/core");
const vm = require("vm");
const fs = require("fs")

module.exports = function (esFile) {

    const code = fs.readFileSync(esFile)
    // 转换为 CommonJS
    const output = babel.transform(code, {
        plugins: ["@babel/plugin-transform-modules-commonjs"]
    });

    // 创建一个新的虚拟 JavaScript 环境，并在其中运行代码
    const script = new vm.Script(output.code);
    const context = vm.createContext({ require, exports: {} });
    script.runInContext(context);

    // 从虚拟环境中获取导出的内容
    const exported = context.exports;

    return exported
}
