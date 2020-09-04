import express from 'express';
import * as http from 'http'
import GameServer from './proto/game/GameServer.js';
import * as process from 'process';
import { performance } from 'perf_hooks';
import SocketioServer from './proto/socketio/SocketioServer.js';
import Ticker from '../../lib/src/Ticker.js';

const app = express();
const server = http.createServer(app);

app.use('/', express.static('../web-build/dist'));

const ticker = new Ticker(setInterval, performance.now);
const gameServer = new GameServer(new SocketioServer(server, ticker), ticker);
ticker.start(gameServer);

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`listening on ${port}`);
});
