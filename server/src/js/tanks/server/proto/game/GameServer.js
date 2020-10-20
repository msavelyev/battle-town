import * as process from 'process';
import EventType from '@Lib/tanks/lib/proto/EventType.js';
import * as dotenv from '@Lib/tanks/lib/util/dotenv.js';
import * as Fps from '@Lib/tanks/lib/util/Fps.js';
import log from '@Lib/tanks/lib/util/log.js';
import database from '@Server/tanks/server/database.js';
import telegram from '@Server/tanks/server/telegram.js';
import NetClient from '@Server/tanks/server/proto/base/NetClient.js';
import FFAGameMode from '@Server/tanks/server/proto/game/FFAGameMode.js';
import Player from '@Server/tanks/server/proto/game/Player.js';
import PVEGameMode from '@Server/tanks/server/proto/game/PVEGameMode.js';
import PVPGameMode from '@Server/tanks/server/proto/game/PVPGameMode.js';

function createGameMode(db, ticker) {
  const gameMode = dotenv.SETTINGS.GAME_MODE;
  switch (gameMode) {
    case 'PVP':
      return new PVPGameMode(db, ticker);
    case 'PVE':
      return new PVEGameMode(ticker);
    case 'FFE':
      return new FFAGameMode(ticker);
    default:
      throw new Error('Unknown game mode ' + gameMode);
  }
}

export default class GameServer {

  constructor(server, ticker, db) {
    this.fps = Fps.fps();
    this.server = server;
    this.ticker = ticker;

    this.db = db;
    this.gameMode = createGameMode(db, ticker);

    this.init();

    this.printFpsInterval = null;
  }

  init() {
    this.gameMode.init();
    this.server.onConnected(this.clientConnected.bind(this));

    this.server.start();

    this.printFpsInterval = setInterval(this.printFps.bind(this), 1000);
  }

  onPlayerAuth(player) {
    const client = player.client;

    return auth => {
      const userId = auth.id;
      const token = auth.token;

      database.findUser(this.db, userId, token)
        .then(user => {
          if (user) {
            player.user = user;
            log.info('authorized', user.id);
            telegram.sendMessage('user authorized ' + user.id + ', ' + user.name);
            NetClient.send(client, EventType.AUTH_ACK);
            this.gameMode.authorizePlayer(player);
          } else {
            throw new Error('Couldn\'t find user');
          }
        })
        .catch(err => {
          log.error('Couldn\'t authorize', userId, token, err);
          NetClient.disconnect(client);
        })
        .then(() => {
          player.onAuth();
        });
    };
  }

  clientConnected(client) {
    const player = new Player(client);
    log.info('connected');

    player.onAuth(this.onPlayerAuth(player));
  }

  update(event) {
    this.gameMode.update(event);
    Fps.update(this.fps);
  }

  printFps() {
    process.stdout.write(`FPS:${this.fps.fps}, tick:${this.ticker.tick}\r`);
  }

  stop() {
    clearInterval(this.printFpsInterval);
  }

}
