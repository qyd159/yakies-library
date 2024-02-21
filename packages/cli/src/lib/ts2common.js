const ts = require('typescript');
const fs = require('fs');
const ivm = require('isolated-vm');

async function transpileModule(tsFile, compilerOptions) {
    const code = fs.readFileSync(tsFile, 'utf8');
    const result = ts.transpileModule(code, { compilerOptions });

    // 创建一个隔离的 V8 虚拟机实例
    const isolate = new ivm.Isolate({ memoryLimit: 128 });
    const context = isolate.createContextSync();

    // 准备一个可以移植至隔离环境的全局对象
    const jail = context.global;
    jail.setSync('global', jail.derefInto());
    jail.setSync('exports', jail.derefInto());

    // 将 'require' 和 'module' 暴露给隔离环境
    jail.setSync('require', function require(module) {
        return global.require(module);
    });
    const module = { exports: {} };
    jail.setSync('module', module, { copy: true });

    // 创建模拟的process对象，只包含env属性
    const processStub = {
        env: Object.assign({}, process.env),
    };
    jail.setSync('process', new ivm.ExternalCopy(processStub).copyInto());
    // 使用 isolate 编译并运行模块封装器函数
    const script = await isolate.compileScript(result.outputText);
    await script.run(context);

    // 获取模块输出
    return jail.getSync('exports').getSync('default').copySync();
}

module.exports = async function (tsFile) {
    return await transpileModule(tsFile, { module: ts.ModuleKind.CommonJS });
};
