import Game from './Game.js';
import Client from './proto/Client.js';
import Ticker from '../../../lib/src/Ticker.js';
import SocketioClient from './proto/SocketioClient.js';
import MessageType from '../../../lib/src/proto/MessageType.js';
import Input from './Input.js';
import EventType from '../../../lib/src/proto/EventType.js';

const UI_WIDTH = 150;

export default class Main {

  constructor(canvas, sprites) {
    this.client = new Client(new SocketioClient());
    this.client.onMessage(MessageType.INIT, this.init.bind(this));

    this.canvas = canvas;
    this.sprites = sprites;

    this.game = null;
    this.ticker = null;
  }

  start() {
    this.client.connect();
  }

  onConnect(cb) {
    this.client.on(EventType.CONNECT, cb);
  }

  onDisconnect(cb) {
    this.client.on(EventType.DISCONNECT, () => {
      cb();

      this.client.onMessage(MessageType.PING);

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
    this.canvas.width = conf.world.width + UI_WIDTH;
    this.canvas.height = conf.world.height;

    const ctx = this.canvas.getContext('2d');

    this.game = new Game(ctx, this.client, this.sprites, conf);
    this.input = new Input(this.game);
    this.client.onMessage(MessageType.TICK, this.game.onSync.bind(this.game));

    this.ticker = new Ticker(
      window.setInterval.bind(null),
      window.performance.now.bind(window.performance)
    );
    this.ticker.start(this.game);
  }

  keydown(event) {
    if (this.input) {
      this.input.keydown(event);
    }
  }

  keyup(event) {
    if (this.input) {
      this.input.keyup(event);
    }
  }

  disconnect() {
    this.client.disconnect();
  }

}
