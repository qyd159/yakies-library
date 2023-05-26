前端开发实用工具集
### Usage
yarn global add @yakies/cli  
运行`ya`命令

### Options
#### 核心功能：
启动一个代理服务器，基本原理可以参考[一个支持热更新的上游服务自动代理程序](https://juejin.cn/post/7136485471194087455)

#### 附加功能: 
命令参数
* --bs, 同时启动`browser-sync`,可以实现css的热替换，给UI添加网格等辅助功能
* exec [widget], 启动内置插件脚本

#### 配置文件
config.js
```js
global.wwwFileMap = {
  // 直接代理
  proxy: {
    // 前端应用访问地址
    target: 'http://localhost:8080/',
    // 接口地址前缀，前端接口访问历史将会被记录，有相应的管理系统，有需要可联系作者
    baseApi: '/v1',
  },
};
```
mock/server.conf
```conf
# 后端接口代理，精细化控制，可使用正则表达式
proxy ^/api/user(.*?)$ http://user.domain/$1
# 接口返回数据mock
rewrite /path/to/api /mock/answer.json
```

#### 编译
使用`ya`命令实现自动化的构建，因为使用rollup一次性打包所有插件会出现堆栈溢出，所以使用runNpmTask脚本实现对插件的逐个打包
```shell
ya exec runNpmTasks --cwd packages/cli
```
