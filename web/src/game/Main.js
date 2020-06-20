import Game from './Game.js';
import Client from './proto/Client.js';
import Renderer from './Renderer.js';
import SocketioClient from './proto/SocketioClient.js';

export default class Main {

  constructor(canvas) {
    this.client = new Client(new SocketioClient());
    this.client.onInit(this.init.bind(this));

    this.canvas = canvas;

    this.game = null;
    this.renderer = null;
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
      if (this.renderer) {
        this.renderer.stop();
      }
      this.renderer = null;
    });
  }

  init(conf) {
    this.canvas.width = conf.world.width;
    this.canvas.height = conf.world.height;

    const ctx = this.canvas.getContext('2d');

    this.game = new Game(this.client, conf);
    this.client.onMove(this.game.onMove.bind(this.game));
    this.client.onConnected(this.game.onConnected.bind(this.game));
    this.client.onDisconnected(this.game.onDisconnected.bind(this.game));

    this.renderer = new Renderer(ctx, this.game);
    this.renderer.start();
  }

  keydown(event) {
    if (this.game) {
      this.game.keydown(event);
    }
  }

}
