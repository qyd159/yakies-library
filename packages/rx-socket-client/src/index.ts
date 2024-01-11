import { QueueingSubject } from 'queueing-subject';
import { emitOnConnect, listenOnConnect, connect, socket } from './socket.io';
import { Socket, SocketOptions, ManagerOptions } from 'socket.io-client';

// this subject queues as necessary to ensure every message is delivered
class RxSocketClient {
  subject;
  pending = false;
  toSend: any[] = [];
  sent: any[] = [];
  socket: Socket;
  constructor(hostPath, options?: Partial<ManagerOptions & SocketOptions>, connectedCb?: (socket: Socket) => void) {
    this.subject = new QueueingSubject<[string, any]>();
    const connect$ = connect(hostPath, options);
    this.socket = socket;
    emitOnConnect(this.subject);
    if (connectedCb) {
      connect$.subscribe(connectedCb);
    }
  }
  emit(message) {
    this.subject.next(message);
  }
  on(event, callback) {
    listenOnConnect(event).subscribe((data) => {
      callback(data);
    });
  }
  close(event, callback) {}
}

export default RxSocketClient;
