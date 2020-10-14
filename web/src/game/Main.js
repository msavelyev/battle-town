import EventType from '../../../lib/src/proto/EventType.js';
import MessageType from '../../../lib/src/proto/MessageType.js';
import * as Ticker from '../../../lib/src/Ticker.js';
import {assign} from '../../../lib/src/util/immutable.js';
import level from '../../../server/src/level/level.js';
import Game from './Game.js';
import Input from './Input.js';

const UI_WIDTH = 22;

function updateSize(size) {
  let unitSize = Math.floor(Math.min(size.pixelWidth / level.WIDTH, size.pixelHeight / level.HEIGHT));
  unitSize = Math.pow(2, Math.floor(Math.log(unitSize) / Math.log(2)));
  return assign(assign({}, size), {
    pixelWidth: (level.WIDTH + UI_WIDTH) * unitSize,
    pixelHeight: level.HEIGHT * unitSize,
    unit: unitSize,
    uiX: (level.WIDTH) * unitSize,
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
    this.client.connect();
  }

  init(conf) {
    this.client.on(EventType.DISCONNECT);
    this.client.on(EventType.DISCONNECT, this.stop.bind(this));

    this.updateCanvasSize();

    const ctx = this.canvas.getContext('2d');

    this.game = new Game(ctx, this.client, this.sprites, conf, this.size);
    this.input = new Input(this.game);
    this.client.onMessage(MessageType.TICK, this.game.onSync.bind(this.game));

    this.ticker = Ticker.create(
      window.setInterval.bind(null),
      window.performance.now.bind(window.performance)
    );
    Ticker.start(this.ticker, this.game);
  }

  disconnect() {
    this.client.disconnect();
  }

  stop() {
    if (this.stopped) {
      return;
    }

    this.stopped = true;

    this.client.onMessage(MessageType.PING);

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
