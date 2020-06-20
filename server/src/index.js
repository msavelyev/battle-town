import express from 'express';
import * as http from 'http'
import GameServer from './proto/GameServer.js';
import SocketioServer from './proto/socketio/SocketioServer.js';

const app = express();
const server = http.createServer(app);

app.get('/', (req, res) => {
  res.send('hello');
});

GameServer.create(new SocketioServer(server));

server.listen(8080, () => {
  console.log('listening on 8080');
});
