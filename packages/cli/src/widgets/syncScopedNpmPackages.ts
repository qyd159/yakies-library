import axios from 'axios';
import { execSync } from 'child_process';
const fs = require('fs').promises;
const path = require('path');

// 当前目录
const directoryPath = process.cwd();

async function findTgzFiles() {
    try {
        // 异步读取当前目录内容
        const files = await fs.readdir(directoryPath);
        
        // 过滤以.tgz结尾的文件
        const tgzFiles = files.filter(file => path.extname(file).toLowerCase() === '.tgz');
        
        // 打印找到的tgz文件
        tgzFiles.forEach(file => console.log(file));
        return tgzFiles
    } catch(err) {
        console.error('Unable to scan directory:', err);
    }
}
const srcRegistry = 'https://nexus.yakies.cn/repository/hosted/'; // 源A的URL
const destRegistry = 'https://npm.yakies.cn/repository/hosted/'; // 源B的URL
const authToken = 'NpmToken.22372cb3-e1fc-36ed-8b84-1bc61707e7c4'; // 源B的认证Token
const scope = '@yakies'; // 您要同步的scope

// 获取指定scope下的所有包
async function getPackagesInScope() {
  // 定义请求的Headers
  const headers = {
    accept: '*/*',
    'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
    'content-type': 'application/json',
    // 注意：cookie需要保密处理，不应在公共代码或版本库中暴露
    cookie:
      'NX-ANTI-CSRF-TOKEN=0.6161645833036753; apt.uid=AP-YFGMCGUNNIFB-2-1715510681627-99164513.0.2.a2e3917a-4f22-4c24-8671-436b74b600a2; apt.sid=AP-YFGMCGUNNIFB-2-1715512549007-25693583; _ga=GA1.1.1724037485.1715512552; _ga_0C4M1PWYZ7=GS1.1.1715512551.1.0.1715512575.0.0.0; _ga_T11SF3WXX2=GS1.1.1715512553.1.0.1715512575.38.0.0; _ga_K2SPJK2C73=GS1.1.1715512554.1.0.1715512575.39.0.0',
    'nx-anti-csrf-token': '0.6161645833036753',
    origin: 'https://nexus.yakies.cn',
    priority: 'u=1, i',
    referer: 'https://nexus.yakies.cn/',
    'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'x-nexus-ui': 'true',
    'x-requested-with': 'XMLHttpRequest',
  };

  // 请求体
  const data = {
    action: 'coreui_Browse',
    method: 'read',
    data: [{ repositoryName: 'hosted', node: '%40yakies' }],
    type: 'rpc',
    tid: 7,
  };
  try {
    // 发送请求
    const response = await axios.post('https://nexus.yakies.cn/service/extdirect', data, { headers: headers });

    return response.data.result.data.map(item => item.id.replace(/%40/g, "@"));
  } catch (error) {
    console.error(error); // 处理错误
    return [];
  }
}

// 使用npm命令同步包
async function syncPackage(packageName) {
  await execSync(`npm pack ${packageName} --registry=${srcRegistry}`);
  await new Promise(resolve => setTimeout(resolve,1000))
  const tgzFiles = await findTgzFiles()
  if(tgzFiles?.length === 0) return
  try {
    await execSync(`npm publish ./${tgzFiles[0]} --registry=${destRegistry}`);
    await new Promise(resolve => setTimeout(resolve,1000))
  }catch(e){}finally{
    await execSync(`rm ./*.tgz`)
    await new Promise(resolve => setTimeout(resolve,1000))
  }
  
}

export default async function syncScopedPackages() {
  const packages = await getPackagesInScope();
  for (const item of packages) {
      await syncPackage(item)
  }
}

// syncScopedPackages();
