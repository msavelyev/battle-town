import EventType from '../../../lib/src/proto/EventType.js';
import MessageType from '../../../lib/src/proto/MessageType.js';
import * as Ticker from '../../../lib/src/Ticker.js';
import {assign} from '../../../lib/src/util/immutable.js';
import Level from '../../../server/src/level/Level.js';
import Game from './Game.js';
import Input from './Input.js';
import Client from './proto/Client.js';

const UI_WIDTH = 22;

function updateSize(size) {
  let unitSize = Math.floor(Math.min(size.pixelWidth / Level.WIDTH, size.pixelHeight / Level.HEIGHT));
  unitSize = Math.pow(2, Math.floor(Math.log(unitSize) / Math.log(2)));
  return assign(assign({}, size), {
    pixelWidth: (Level.WIDTH + UI_WIDTH) * unitSize,
    pixelHeight: Level.HEIGHT * unitSize,
    unit: unitSize,
    uiX: (Level.WIDTH) * unitSize,
  });
}

export default class Main {

  constructor(canvas, sprites, client, size, onDisconnect) {
    this.client = client;

    this.canvas = canvas;
    this.sprites = sprites;
    this.size = updateSize(size);

    this.game = null;
    this.ticker = null;
    this.onDisconnect = onDisconnect;

    this.stopped = false;
  }

  start() {
    Client.connect(this.client);
  }

  init(conf) {
    Client.on(this.client, EventType.DISCONNECT);
    Client.on(this.client, EventType.DISCONNECT, this.stop.bind(this));

    this.updateCanvasSize();

    const ctx = this.canvas.getContext('2d');

    this.game = new Game(ctx, this.client, this.sprites, conf, this.size);
    this.input = new Input(this.game);
    Client.onMessage(this.client, MessageType.TICK, this.game.onSync.bind(this.game));

    this.ticker = Ticker.create(
      window.setInterval.bind(null),
      window.performance.now.bind(window.performance)
    );
    Ticker.start(this.ticker, this.game);
  }

  disconnect() {
    Client.disconnect(this.client);
  }

  stop() {
    if (this.stopped) {
      return;
    }

    this.stopped = true;

    Client.onMessage(this.client, MessageType.PING);

    if (this.game) {
      this.game.stop();
    }
    this.game = null;
    if (this.ticker) {
      Ticker.stop(this.ticker);
    }
    this.ticker = null;

    this.onDisconnect();
  }

  updateCanvasSize() {
    this.canvas.width = this.size.pixelWidth;
    this.canvas.height = this.size.pixelHeight;
    this.canvas.style.width = `${this.size.screenWidth}px`;
    this.canvas.style.height = `${this.size.screenHeight}px`;

    const ctx = this.canvas.getContext('2d');
    ctx.scale(this.size.scale, this.size.scale);
  }

  resize(size) {
    this.size = updateSize(size);
    this.updateCanvasSize();
    this.game.resize(this.size);
  }

}
