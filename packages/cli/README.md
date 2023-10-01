前端开发实用工具集

### Usage

yarn global add @yakies/cli  
运行`ya`命令

### Options

#### 核心功能：

启动一个代理服务器，基本原理可以参考[一个支持热更新的上游服务自动代理程序](https://juejin.cn/post/7136485471194087455)

#### 附加功能:

命令参数

- --bs, 同时启动`browser-sync`,可以实现 css 的热替换，给 UI 添加网格等辅助功能
- exec [widget], 启动内置插件脚本

#### 配置文件

.yarc.ts

````js
export default {
  useHttps: true,
  httpProxy: [
    {
      target: 'http://localhost:8080/',
    },
  ],
  ytt: [
    {
      serverUrl,
      serverType: 'swagger',
      outputDir: `path/to/generated/xxx`,
      overwriteRequestFile: false,
      projects: [
        {
          token: '',
          categories: [
            {
              id: 0,
              prefix: /\/api\/xxx/,
              prefixReserve: false,
            },
          ],
        },
      ],
    }
  ],
}```

mock/server.conf

```conf
# 后端接口代理，精细化控制，可使用正则表达式
proxy ^/api/user(.*?)$ http://user.domain/$1
# 接口返回数据mock
rewrite /path/to/api /mock/answer.json
````

#### 编译

使用`ya`命令实现自动化的构建，因为使用 rollup 一次性打包所有插件会出现堆栈溢出，所以使用 runNpmTask 脚本实现对插件的逐个打包

```shell
ya exec runNpmTasks --cwd packages/cli
```
