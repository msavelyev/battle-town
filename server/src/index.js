import express from 'express';
import * as http from 'http'
import GameServer from './proto/game/GameServer.js';
import WrtcServer from './proto/wrtc/WrtcServer.js';

const app = express();
const server = http.createServer(app);

app.use('/', express.static('../web-build/dist'));

GameServer.create(new WrtcServer(app));

server.listen(8080, () => {
  console.log('listening on 8080');
});
