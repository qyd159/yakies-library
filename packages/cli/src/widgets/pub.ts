import { exec } from 'child_process';

export default function (args) {
  const command = `${
    args.dir ? 'cd ' + args.dir + '&&' : ''
  }/bin/zsh -i -c 'source ~/.zshrc.local; npm publish --registry=https://nexus.yakies.cn/repository/hosted/'`;
  const child = exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`执行出错: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
  // 将子进程的 stdout 连接到父进程的 stdout
  child.stdout.pipe(process.stdout);

  // 将子进程的 stderr 连接到父进程的 stderr
  child.stderr.pipe(process.stderr);
}
