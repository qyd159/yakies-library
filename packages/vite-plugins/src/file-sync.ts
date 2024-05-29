import { watch } from 'chokidar';
import fs from 'fs-extra'; // fs-extra用于更方便地执行文件复制操作

// 自定义插件
export function FileSync(options:{watchDir: string, destDir: string}) {
  return {
    name: 'vite-plugin-file-sync', // 插件名称
    configureServer() {
      // 插件安装时的钩子，用于设置文件监听
      const { watchDir, destDir } = options;
      watch(watchDir, { persistent: true }).on('all', (event: string, path: string) => {
        const destPath = path.replace(watchDir, destDir); // 计算目标路径
        if (event === 'add' || event === 'change') {
          fs.copy(path, destPath)
            .then(() => console.log(`File ${path} was copied to ${destPath}`))
            .catch((err: any) => console.error(err));
        } else if (event === 'unlink') {
          fs.remove(destPath)
            .then(() => console.log(`File ${destPath} was removed`))
            .catch((err: any) => console.error(err));
        }
      });
    },
  };
}

