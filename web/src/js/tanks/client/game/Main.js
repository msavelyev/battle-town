import EventType from '@Lib/tanks/lib/proto/EventType.js';
import MessageType from '@Lib/tanks/lib/proto/MessageType.js';
import Ticker from '@Lib/tanks/lib/Ticker.js';
import immutable from '@Lib/tanks/lib/util/immutable.js';
import Level from '@Lib/tanks/lib/level/Level.js';
import Game from '@Client/tanks/client/game/Game.js';
import Input from '@Client/tanks/client/game/Input.js';
import Client from '@Client/tanks/client/game/proto/Client.js';

import gameloop from '@Cljs/code/tanks.client.gameloop.js';

const UI_WIDTH = 22;

function updateSize(size) {
  let unitSize = Math.floor(Math.min(size.pixelWidth / Level.WIDTH, size.pixelHeight / Level.HEIGHT));
  unitSize = Math.pow(2, Math.floor(Math.log(unitSize) / Math.log(2)));
  return immutable.assign(immutable.assign({}, size), {
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

    this.input = new Input();
    this.game = new Game(ctx, this.client, this.sprites, conf, this.size, this.input);
    Client.onMessage(this.client, MessageType.TICK, tickData => {
      Client.storeTick(this.client, tickData);
    });

    this.ticker = Ticker.create(
      window.setInterval.bind(null),
      window.performance.now.bind(window.performance)
    );
    const gameLoop = gameloop.create_game_loop(
      this.game,
      ctx,
      this.input,
      gameloop.create_client(Client, this.client)
    );
    Ticker.start(this.ticker, gameLoop);
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
