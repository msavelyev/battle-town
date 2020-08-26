import express from 'express';
import * as http from 'http'
import GameServer from './proto/game/GameServer.js';
import WrtcServer from './proto/wrtc/WrtcServer.js';
import * as process from 'process';

const app = express();
const server = http.createServer(app);

app.use('/', express.static('../web-build/dist'));

GameServer.create(new WrtcServer(app));

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`listening on ${port}`);
});
