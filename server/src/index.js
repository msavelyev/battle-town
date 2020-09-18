import express from 'express';
import * as http from 'http'
import log from '../../lib/src/util/log.js';
import GameServer from './proto/game/GameServer.js';
import * as process from 'process';
import { performance } from 'perf_hooks';
import SocketioServer from './proto/socketio/SocketioServer.js';
import Ticker from '../../lib/src/Ticker.js';
import api from './api.js';
import database from './database.js';
import dotenv from '../../lib/src/util/dotenv.js';

dotenv();

const app = express();
const server = http.createServer(app);

app.use('/', express.static('../web-build/dist'));

async function main() {
  const dbPath = process.env.DB_PATH;
  if (!dbPath) {
    throw new Error('DB_PATH env variable must be specified');
  }

  const db = await database.open(dbPath);
  await api.init(db, app);

  const ticker = new Ticker(setInterval, performance.now);
  const gameServer = new GameServer(new SocketioServer(server), ticker, db);
  ticker.start(gameServer);

  const port = process.env.PORT || 8080;
  server.listen(port, () => {
    log.info(`listening on ${port}`);
  });
}


main()
  .then()
  .catch(err => {
    console.error('unhandled exception', err);
  });

