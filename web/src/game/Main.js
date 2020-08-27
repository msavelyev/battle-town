import Game from './Game.js';
import Client from './proto/Client.js';
import Ticker from '../../../lib/src/Ticker.js';
import SocketioClient from './proto/SocketioClient.js';
import MessageType from '../../../lib/src/proto/MessageType.js';

export default class Main {

  constructor(canvas) {
    this.client = new Client(new SocketioClient());
    this.client.on(MessageType.INIT, this.init.bind(this));

    this.canvas = canvas;

    this.game = null;
    this.ticker = null;
  }

  start() {
    this.client.connect();
  }

  onConnect(cb) {
    this.client.on(MessageType.CONNECT, cb);
  }

  onDisconnect(cb) {
    this.client.on(MessageType.DISCONNECT, () => {
      cb();

      this.client.on(MessageType.MOVE);
      this.client.on(MessageType.CONNECTED);
      this.client.on(MessageType.DISCONNECTED);
      this.client.on(MessageType.PING);

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
    this.client.on(MessageType.MOVE, this.game.onMove.bind(this.game));
    this.client.on(MessageType.SHOOT, this.game.onShoot.bind(this.game));
    this.client.on(MessageType.CONNECTED, this.game.onConnected.bind(this.game));
    this.client.on(MessageType.DISCONNECTED, this.game.onDisconnected.bind(this.game));
    this.client.on(MessageType.KILLED, this.game.onKilled.bind(this.game));
    this.client.on(MessageType.SCORE, this.game.onScore.bind(this.game));
    this.client.on(MessageType.BULLET_EXPLODED, this.game.onBulletExploded.bind(this.game));
    this.client.on(MessageType.SYNC, this.game.onSync.bind(this.game));

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
