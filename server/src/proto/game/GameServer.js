import * as process from 'process';
import Fps from '../../../../lib/src/util/Fps.js';
import log from '../../../../lib/src/util/log.js';
import database from '../../database.js';
import Player from './Player.js';
import PVPGameMode from './PVPGameMode.js';

export default class GameServer {

  constructor(server, ticker, db) {
    this.fps = new Fps();
    this.server = server;
    this.ticker = ticker;

    this.db = db;
    this.pvp = new PVPGameMode(db, ticker);

    this.init();

    this.printFpsInterval = null;
  }

  init() {
    this.server.onConnected(this.clientConnected.bind(this));

    this.server.start();

    this.printFpsInterval = setInterval(this.printFps.bind(this), 1000);
    this.pvp.init();
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
            this.pvp.authorizePlayer(player, user);
          } else {
            throw new Error('Couldn\'t find user');
          }
        })
        .catch(err => {
          log.error('Couldn\'t authorize', userId, token, err);
          client.disconnect();
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
    this.pvp.update(event);
    this.fps.update(event);
  }

  printFps() {
    process.stdout.write(`FPS:${this.fps.fps}, tick:${this.ticker.tick}\r`);
  }

  stop() {
    clearInterval(this.printFpsInterval);
  }

}
