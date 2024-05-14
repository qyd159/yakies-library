import { RequestInterceptor } from 'node-request-interceptor';
import withDefaultInterceptors from 'node-request-interceptor/lib/presets/default';

// @ts-ignore
const interceptor = new RequestInterceptor(withDefaultInterceptors.default);

// 函数将HTTP请求对象转换为cURL命令字符串
function requestToCurl(req) {
  let curl = `curl -X ${req.method}`;

  // 添加请求头部信息
  for (const header in req.headers) {
    curl += ` -H "${header}: ${req.headers[header]}"`;
  }

  // 特殊处理，如有内容类型是 application/json 的话，添加 -H "Content-Type: application/json"
  if (req.headers['content-type']) {
    curl += ` -H "Content-Type: ${req.headers['content-type']}"`;
  }

  // 构建请求URL
  const url = `${req.url.protocol}://${req.url.host}${req.url.pathname}?${req.url.search}`;
  curl += ` "${url}"`;

  // 如果是POST或PUT请求，假设body需要从其他地方获取
  // 这里不直接从req中读取请求体，因为req是一个stream
  // 你可能需要在实际使用时，根据你的应用逻辑从别处获取或传递请求体数据
  if (['POST', 'PUT'].includes(req.method)) {
    // 假设postData是已知的请求体数据
    const postData = JSON.stringify(req.body);
    curl += ` -d '${postData}'`;
    // 注意：在这里添加-d选项或者--data选项用于POST或PUT数据，需要根据实际情况获取请求体内容
    // 上述代码中已注释，因为在真实场景中获取请求体内容较为复杂（需要异步读取流等）
  }

  return curl;
}

interceptor.use((req) => {
  // Will print to stdout any outgoing requests
  // without affecting their responses
  if (req.url.href.indexOf('nacos-cs.nacos') !== -1) return;
  console.info('%s %s', req.method, req.url.href, req.body);
  if (process.env.PRINT_CURL) console.log(requestToCurl(req));
});

// interceptor.on('response', (_req,response) => {
//    console.info(response.body)
// })
