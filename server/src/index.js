import express from 'express';
import * as http from 'http'
import GameServer from './proto/GameServer.js';

const app = express();
const server = http.createServer(app);

app.get('/', (req, res) => {
  res.send('hello');
});

GameServer.create(server);

server.listen(8080, () => {
  console.log('listening on 8080');
});
