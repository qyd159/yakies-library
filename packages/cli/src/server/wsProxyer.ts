import * as http from 'http';
import * as httpProxy from 'http-proxy';
import * as WebSocket from 'ws';
import WebSocketServer = WebSocket.Server;

// 创建 WebSocket 代理
const wsProxy: httpProxy = httpProxy.createProxyServer({ ws: true });
const wsServer: WebSocketServer = new WebSocket.Server({ noServer: true });

// 创建 WebSocket 服务器
const server: http.Server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
  //处理 HTTP 请求
  //该函数会回调每个请求到达服务器时
});

// WebSocket 服务器处理连接事件
wsServer.on('connection', (clientSocket: WebSocket, req: http.IncomingMessage) => {
  console.log('Connected to WebSocket server');

  const target: WebSocket = new WebSocket('wss://target-websocket-server.example');

  target.on('open', () => {
    // 监听目标 WebSocket 'open' 事件后，向客户端发送消息
    clientSocket.send('Message from proxy server');
  });

  target.on('message', (message: string) => {
    // 在此处处理，可能修改目标 WebSocket 传入的消息
    console.log('Message from target WebSocket server: ', message);
    clientSocket.send(message);
  });

  // 监听来自客户端的消息
  clientSocket.on('message', (message: string) => {
    // 在此处处理，可能修改客户端传入的消息
    console.log('Message from client: ', message);
    target.send(message);
  });

  // 关闭事件处理
  clientSocket.on('close', () => {
    target.close();
  });
});

// 监听'upgrade'事件并处理WebSocket请求
server.on('upgrade', (req: http.IncomingMessage, socket, head) => {
  wsServer.handleUpgrade(req, socket, head, (clientSocket) => {
    wsServer.emit('connection', clientSocket, req);
  });
});

//启动服务器，监听特定端口
server.listen(3000, () => {
  console.log('Server listening at port 3000');
});
