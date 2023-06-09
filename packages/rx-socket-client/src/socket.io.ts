import { of, fromEvent, Observable } from 'rxjs';
import { map, switchMap, mergeMap } from 'rxjs/operators';
import { io, SocketOptions, ManagerOptions } from 'socket.io-client';
// Initialise Socket.IO and wrap in observable
let connect$!: Observable<any>;

export function connect(hostPath, options: Partial<ManagerOptions & SocketOptions> = { transports: ['websocket'] }) {
  const parsedUrl = new URL(hostPath);
  const scheme = parsedUrl.protocol === 'http:' ? 'ws://' : 'wss://';
  const host = parsedUrl.host;
  const socket = io(host || `${scheme}${host}`, { ...options, path: parsedUrl.pathname });
  const socket$ = of(socket);
  connect$ = socket$.pipe(
    switchMap((socket) =>
      fromEvent(socket, 'connect').pipe(
        map(() => {
          return socket;
        })
      )
    )
  );
}

// Stream of connections

// On connection, listen for event
export function listenOnConnect(event) {
  return connect$ && connect$.pipe(switchMap((socket) => fromEvent(socket, event)));
}

// On connection, emit data from observable
export function emitOnConnect(observable$) {
  connect$ &&
    connect$
      .pipe(
        switchMap((socket) => {
          return observable$.pipe(
            map((data) => {
              return { socket, data };
            })
          );
        })
      )
      .subscribe(({ socket, data }) => {
        const [type, message] = data;
        socket.emit(type, message);
      });
}
