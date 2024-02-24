import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

export default function (args) {
  // 创建一个新的 cookie jar 用于存储 cookie
  const cookieJar = new CookieJar();

  // 创建一个新的 axios 实例，并配置它使用 cookie jar
  const client = wrapper(
    axios.create({
      withCredentials: true,
      jar: cookieJar, // 将 cookie jar 赋给新实例
    })
  );
  // 发送一个 GET 请求
  client
    .post('https://openai.yakies.cn/api/user/login', { username: 'root', password: 'Qyd245125' })
    .then((response) => {
      // 执行一些处理，此时 cookie 已经保存到 cookieJar 中
      console.log(response);
      // 发送另一个请求，cookie 会被自动附加
      return client.get('https://openai.yakies.cn/api/user/token');
    })
    .then((response) => {
      // 处理第二个请求的响应数据
      console.log(response.data);
    });
}
