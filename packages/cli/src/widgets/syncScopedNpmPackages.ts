const axios = require('axios');
const { exec } = require('child_process');

const srcRegistry = 'https://nexus.yakies.cn/repository/hosted'; // 源A的URL
const destRegistry = 'https://npm.yakies.cn/repository/hosted'; // 源B的URL
const authToken = 'NpmToken.22372cb3-e1fc-36ed-8b84-1bc61707e7c4'; // 源B的认证Token
const scope = '@yakies'; // 您要同步的scope

// 获取指定scope下的所有包
async function getPackagesInScope() {
  try {
    const url = `${srcRegistry}-/v1/search?text=scope:${scope}&size=250`; // 注意：调整size以合适地获取包，npm的最大限制通常为250
    const response = await axios.get(url);
    return response.data.objects.map(pkg => pkg.package.name);
  } catch (error) {
    console.error('获取指定scope的包时出错:', error);
    return [];
  }
}

// 使用npm命令同步包
function syncPackage(packageName) {
  const command = `npm pack ${packageName} --registry=${srcRegistry} && npm publish ./*.tgz --registry=${destRegistry} --//${destRegistry.slice(8)}:_authToken=${authToken} && rm ./*.tgz`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`执行同步命令失败: ${error}`);
      return;
    }
    console.log(`Package ${packageName} synced successfully.`);
  });
}

export default async function syncScopedPackages() {
  const packages = await getPackagesInScope();
  packages.forEach(syncPackage);
}

// syncScopedPackages();
