import { of, fromEvent, Observable } from 'rxjs';
import { map, switchMap, mergeMap, takeUntil } from 'rxjs/operators';
import { Server as socketServer, Socket } from 'socket.io';
import http from 'http';

// Initialise Socket.IO and wrap in observable
let io$: Observable<socketServer>;

export default function init(server: http.Server) {
  io$ = of(new socketServer(server, { allowEIO3: true, cors: { credentials: false } }));
  // Stream of connections
  const connection$ = io$.pipe(switchMap((io) => fromEvent(io, 'connection').pipe(map((client: any) => ({ io, client })))));

  // Stream of disconnections
  const disconnect$ = connection$.pipe(mergeMap(({ client }) => fromEvent(client, 'disconnect').pipe(map(() => client))));

  // On connection, listen for event
  function listenOnConnect(event) {
    return connection$.pipe(
      mergeMap(({ io, client }) =>
        fromEvent(client, event).pipe(
          takeUntil(fromEvent(client, 'disconnect')),
          map((data: any) => ({ io, client, data }))
        )
      )
    );
  }
  return { connection$, disconnect$, listenOnConnect, server };
}
