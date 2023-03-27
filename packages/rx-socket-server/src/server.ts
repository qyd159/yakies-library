import express, { Express, Application, RequestHandler } from 'express';
import http from 'http';
import path from 'path';
import cors from 'cors';
import initRxCon from './connection';

type RxCon = ReturnType<typeof initRxCon>;

function init({ middlewares }: { middlewares: RequestHandler[] }): { app: Express } & RxCon {
  const app = express();
  app.use(cors());
  for (const middleware of middlewares) {
    app.use(middleware);
  }
  if (process.env.ENV === 'development' && process.env.STATIC_DIR) {
    // Serve built client files
    app.use(express.static(path.join(process.cwd(), process.env.STATIC_DIR)));
  }
  // Create HTTP server with "app" as handler
  return { ...initRxCon(http.createServer(app)), app };
}
export default init;
