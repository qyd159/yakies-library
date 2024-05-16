import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';
import axios from 'axios';
import fs from 'fs'
import FormData from 'form-data'
import path from 'path'
// import '../lib/http-intercept';

export default async function (args) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // Create a new cookie jar for storing cookies.
  const cookieJar = new CookieJar();
  const headerIntercepter = require('axios-header-interceptor');

  // Wrap the existing HttpService of NestJS which internally uses Axios.
  // Then set withCredentials and cookieJar to make sure cookies are handled.
  const client = wrapper(
    axios.create({
      withCredentials: true,
      jar: cookieJar,
    })
  );
  // const baseUrl = 'https://release.yakies.cn';
  const baseUrl = 'http://localhost:3100';
  const { data } = await client.post(baseUrl + '/api/auth/login', {
    username: 'admin',
    password: '123456',
  });
  client.interceptors.response.use(
    headerIntercepter.addHeaders({ Authorization: `Bearer ${data.token}` }),
  );
  args.flavor = args.flavor ?? 'default'
  args.channel = args.channel ?? 'alpha'
  args.platform = args.platform ?? 'windows_64'

  try {
    // 添加version
    await client.post(baseUrl + '/api/version', { "id": `${args.version}_${args.flavor}`, "name": args.version, "notes": args.note ?? "", "channel": args.channel, "availability": new Date().toDateString(), "flavor": args.flavor }, {
      headers: {
        Authorization: `Bearer ${data.token}`
      },
    })
  } catch (e) {
    console.log(`maybe version ${args.version} exists`)
  }

  const { Throttle } = require('stream-throttle');

  // 设定限速值，单位为字节每秒（比如这里限制为5Mb/s）
  const rate = 5000 * 1024;


  // 使用fs.createReadStream读取文件
  const fileStream = fs.createReadStream(args.file);

  // 使用stream-throttle限速
  const throttleStream = new Throttle({ rate: rate });

  const formData = new FormData()
  formData.append('version',args.version)
  formData.append('platform',args.platform)
  formData.append('token',args.version+'_'+ args.flavor)
  formData.append('file',fileStream,path.basename(args.file))

  try {
    const { data: uploadResult } = await client.post(baseUrl + '/api/asset', /**{
      file: fileStream,
      token: data.token,
      version: args.version + '_' + args.flavor,
      platform: args.platform
    }**/formData, {
      headers: {
        // 需要将form-data的headers合并到请求头中，这样`Content-Type`会包含正确的`boundary`
        ...formData.getHeaders(),
        Authorization: `Bearer ${data.token}`
      },
      // onUploadProgress事件处理函数
      onUploadProgress: progressEvent => {
        // const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Upload progress: ${progressEvent.loaded}`);
      }
    });
    console.log(uploadResult)

  } catch (e) {
    console.log('上传失败\n', e.stack + '\n', e.response.data + '\n')
  }

}
