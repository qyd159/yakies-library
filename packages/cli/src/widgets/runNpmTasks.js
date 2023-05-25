const path = require('path');
const _ = require("../lib/util");
const { spawn } = require('child_process');

module.exports = function (args) {
  const widgets = _.getAllFiles(args.dir ?? __dirname, null, '.js', {})
  // 定义要依次执行的 npm 命令参数列表
  const tasks = widgets.map(item => path.parse(item.path).name);
  // 递归函数，用于依次执行 npm 命令列表中的命令
  function runTasks(index) {
    // 如果已经执行完所有命令，则结束递归
    if (index === tasks.length) {
      return;
    }
    // 创建子进程，并在子进程中执行当前命令
    const taskProcess = spawn('pnpm', ['run', 'build', '--filter', tasks[index]], { cwd: path.join(process.cwd(), args.cwd ?? '') });
    // 监听子进程的输出
    taskProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    taskProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
    // 当子进程退出时，继续执行下一个命令
    taskProcess.on('close', () => {
      runTasks(index + 1);
    });
  }
  // 开始执行第一个命令
  runTasks(0);

}
