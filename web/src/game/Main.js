import Game from './Game.js';
import Client from './proto/Client.js';
import WrtcClient from './proto/WrtcClient.js';
import Ticker from '../../../lib/src/Ticker.js';

export default class Main {

  constructor(canvas) {
    this.client = new Client(new WrtcClient());
    this.client.onInit(this.init.bind(this));

    this.canvas = canvas;

    this.game = null;
    this.ticker = null;
  }

  start() {
    this.client.connect();
  }

  onConnect(cb) {
    this.client.onConnect(cb);
  }

  onDisconnect(cb) {
    this.client.onDisconnect(() => {
      cb();

      this.client.onMove();
      this.client.onConnected();
      this.client.onDisconnected();
      this.client.onPong();

      if (this.game) {
        this.game.stop();
      }
      this.game = null;
      if (this.ticker) {
        this.ticker.stop();
      }
      this.ticker = null;
    });
  }

  init(conf) {
    this.canvas.width = conf.world.width;
    this.canvas.height = conf.world.height;

    const ctx = this.canvas.getContext('2d');

    this.game = new Game(ctx, this.client, conf);
    this.client.onMove(this.game.onMove.bind(this.game));
    this.client.onShoot(this.game.onShoot.bind(this.game));
    this.client.onConnected(this.game.onConnected.bind(this.game));
    this.client.onDisconnected(this.game.onDisconnected.bind(this.game));
    this.client.onNewTank(this.game.newTank.bind(this.game));

    this.ticker = new Ticker(this.game, requestAnimationFrame.bind(null));
    this.ticker.start();
  }

  keydown(event) {
    if (this.game) {
      this.game.keydown(event);
    }
  }

  disconnect() {
    this.client.disconnect();
  }

}
