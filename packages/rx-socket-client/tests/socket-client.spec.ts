import { describe, expect, test, it, beforeAll } from 'vitest'
import SocketClient from '..'
describe('测试socket-client', () => {
  it('socket path设置', () => {
    const socketClient = new SocketClient('http://localhost:3344/chat-api')
    socketClient.on('connection', (data) => {
      console.log(data)
    })
  })
})
