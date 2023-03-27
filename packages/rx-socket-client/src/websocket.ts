import { Subscription, Observable } from 'rxjs';
import { share, switchMap, retryWhen, delay } from 'rxjs/operators';
import makeWebSocketObservable, { GetWebSocketResponses, normalClosureMessage } from 'rxjs-websockets';

let socket$;
let messages$!: Observable<WebSocketPayload>;
let messagesSubscription!: Subscription;

export function connect(path) {
  const parsedUrl = new URL(path);
  // create the websocket observable, does *not* open the websocket connection
  const scheme = parsedUrl.protocol === 'http:' ? 'ws://' : 'wss://';
  const host = parsedUrl.host;
  socket$ = makeWebSocketObservable(`${scheme}${host}${path}`);
}

export function listenOnConnect(event, callback) {
  messagesSubscription = messages$.subscribe(
    (message: WebSocketPayload) => {
      console.log('received message:', message);
      if (event === 'msg') {
        callback(message);
      }
    },
    (error: Error) => {
      const { message } = error;
      if (message === normalClosureMessage) {
        console.log('server closed the websocket connection normally');
      } else {
        console.log('socket was disconnected due to error:', message);
      }
    },
    () => {
      // The clean termination only happens in response to the last
      // subscription to the observable being unsubscribed, any
      // other closure is considered an error.
      console.log('the connection was closed in response to the user');
    }
  );
}

export function emitOnConnect(input$) {
  messages$ = socket$.pipe(
    // the observable produces a value once the websocket has been opened
    switchMap((value: { input$ }) => {
      console.log('websocket opened');
      return input$;
    }),
    retryWhen((errors) => errors.pipe(delay(1000))),
    share()
  );
  return messages$;
}

export function closeWebsocket() {
  // this also caused the websocket connection to be closed
  messagesSubscription && messagesSubscription.unsubscribe();
}

// setTimeout(closeWebsocket, 2000)
