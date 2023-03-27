import { QueueingSubject } from 'queueing-subject';
import { emitOnConnect, listenOnConnect, connect } from './socket.io';
import io, { SocketOptions, ManagerOptions } from 'socket.io-client';

// this subject queues as necessary to ensure every message is delivered
class RxSocketClient {
  subject;
  pending = false;
  toSend: any[] = [];
  sent: any[] = [];
  constructor(hostPath, options?: Partial<ManagerOptions & SocketOptions>) {
    this.subject = new QueueingSubject<string>();
    connect(hostPath, options);
    emitOnConnect(this.subject);
  }
  emit(message) {
    this.subject.next(message);
  }
  on(event, callback) {
    listenOnConnect(event).subscribe((data) => {
      callback(data);
    });
  }
}

export default RxSocketClient;
