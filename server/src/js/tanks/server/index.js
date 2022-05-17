import express from 'express';
import * as http from 'http'
import log from 'Lib/tanks/lib/util/log.js';
import GameServer from 'Server/tanks/server/proto/game/GameServer.js';
import * as process from 'process';
import {performance} from 'perf_hooks';
import SocketioServer from 'Server/tanks/server/proto/socketio/SocketioServer.js';
import * as Ticker from 'Lib/tanks/lib/Ticker.js';
import api from 'Server/tanks/server/api.js';
import database from 'Server/tanks/server/database.js';
import * as dotenv from 'Lib/tanks/lib/util/dotenv.js';

dotenv.dotenv();

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

  const ticker = Ticker.create(setInterval, performance.now);
  const gameServer = new GameServer(SocketioServer(server), ticker, db);
  Ticker.start(ticker, gameServer);

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

