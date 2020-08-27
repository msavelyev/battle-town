import express from 'express';
import * as http from 'http'
import GameServer from './proto/game/GameServer.js';
import * as process from 'process';
import SocketioServer from './proto/socketio/SocketioServer.js';

const app = express();
const server = http.createServer(app);

app.use('/', express.static('../web-build/dist'));

GameServer.create(new SocketioServer(server));

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`listening on ${port}`);
});
