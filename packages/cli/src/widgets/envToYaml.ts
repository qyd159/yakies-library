const fs = require('fs');
const yaml = require('js-yaml');

// 假设你的输入文件叫 'env.txt'
const inputFile = '.env';
export default function (args) {
  fs.readFile(args.f || inputFile, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file: ${err}`);
      return;
    }

    // 将输入处理为对象
    const envObj = data.split('\n').reduce((obj, line) => {
      // 忽略空行和注释
      if (line && !line.startsWith('#')) {
        // 拆分键值对
        const [key, value] = line.split('=');
        obj[key.trim()] = value
          .trim()
          .replace(/^"(.*)"$/, '$1')
          .replace(/^'(.*)'$/, '$1');
      }
      return obj;
    }, {});

    // 转换为 YAML
    const yamlStr = yaml.dump(envObj);

    // 输出 YAML 字符串
    console.log(yamlStr);

    // 如果需要写入到文件
    // const outputFile = 'configmap.yaml';
    // fs.writeFile(outputFile, yamlStr, (err) => {
    //   if (err) {
    //     console.error(`Error writing to file: ${err}`);
    //   } else {
    //     console.log(`YAML written to ${outputFile}`);
    //   }
    // });
  });
}
