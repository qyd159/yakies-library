import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';
import axios from 'axios';
import fs from 'fs'
import FormData from 'form-data'
import path from 'path'

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
  const baseUrl = 'https://release.yakies.cn';
  const {data} = await client.post(baseUrl + '/api/auth/login',{
    username: 'admin',
    password: '123456',
  });
  client.interceptors.response.use(
    headerIntercepter.addHeaders({ Authorization: `Bearer ${data.token}` }),
  );
  args.flavor=args.flavor??'default'
  args.channel=args.channel??'alpha'

  // 添加version
  await client.post(baseUrl + '/api/version',{"id":`${args.version}_default`,"name":args.version ,"notes":"","channel":args.channel,"availability":new Date().toDateString(),"flavor":args.flavor},{
    headers: {
        Authorization: `Bearer ${data.token}`
    },
  })
  const form = new FormData();
  form.append('file', fs.createReadStream(args.file), path.basename(args.file));
  form.append('token', data.token);
  form.append('version', args.version);
  form.append('platform', args.platform);
  const {data: uploadResult} = await client.post(baseUrl + '/api/asset',form,{
    headers: {
        // 需要将form-data的headers合并到请求头中，这样`Content-Type`会包含正确的`boundary`
        ...form.getHeaders(),
        Authorization: `Bearer ${data.token}`
    },
     // onUploadProgress事件处理函数
     onUploadProgress: progressEvent => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Upload progress: ${percentCompleted}%`);
    }
  });
  console.log(uploadResult)
}
