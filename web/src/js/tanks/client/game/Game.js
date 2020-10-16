import * as Direction from '@Lib/tanks/lib/data/primitives/Direction.js';
import * as Match from '@Lib/tanks/lib/data/Match.js';
import Point from '@Lib/tanks/lib/data/primitives/Point.js';
import * as World from '@Lib/tanks/lib/data/World.js';
import * as TankMove from '@Lib/tanks/lib/event/TankMove.js';
import MessageType from '@Lib/tanks/lib/proto/MessageType.js';
import NetMessage from '@Lib/tanks/lib/proto/NetMessage.js';
import {copy} from '@Lib/tanks/lib/util/immutable.js';
import increaseTick from '@Lib/tanks/lib/util/increaseTick.js';
import Client from '@Client/tanks/client/game/proto/Client.js';
import brickRenderer from '@Client/tanks/client/game/renderer/blocks/brickRenderer.js';
import jungleRenderer from '@Client/tanks/client/game/renderer/blocks/jungleRenderer.js';
import stoneRenderer from '@Client/tanks/client/game/renderer/blocks/stoneRenderer.js';
import waterRenderer from '@Client/tanks/client/game/renderer/blocks/waterRenderer.js';
import bulletRenderer from '@Client/tanks/client/game/renderer/bulletRenderer.js';
import explosionsRenderer from '@Client/tanks/client/game/renderer/explosionsRenderer.js';
import matchStateRenderer from '@Client/tanks/client/game/renderer/matchStateRenderer.js';
import spawnInRenderer from '@Client/tanks/client/game/renderer/spawnInRenderer.js';
import emptyTextProvider from '@Client/tanks/client/game/renderer/text/emptyTextProvider.js';
import matchTimeTextProvider from '@Client/tanks/client/game/renderer/text/matchTimeTextProvider.js';
import netUsageRenderer from '@Client/tanks/client/game/renderer/text/netUsageTextProvider.js';
import positionTextRenderer from '@Client/tanks/client/game/renderer/text/positionTextRenderer.js';
import scoreTextProvider from '@Client/tanks/client/game/renderer/text/scoreTextProvider.js';
import tankRenderer from '@Client/tanks/client/game/renderer/tankRenderer.js';
import fpsTextProvider from '@Client/tanks/client/game/renderer/text/fpsTextProvider.js';
import pingTextProvider from '@Client/tanks/client/game/renderer/text/pingTextProvider.js';
import textRenderer from '@Client/tanks/client/game/renderer/text/textRenderer.js';
import tickTextProvider from '@Client/tanks/client/game/renderer/text/tickTextProvider.js';
import unackedInputTextProvider from '@Client/tanks/client/game/renderer/text/unackedInputTextProvider.js';
import unitSizeTextProvider from '@Client/tanks/client/game/renderer/text/unitSizeTextProvider.js';
import thisIsYouRenderer from '@Client/tanks/client/game/renderer/thisIsYouRenderer.js';

import renderer from '@ClientCljs/tanks.client.renderer.js';

export default class Game {

  constructor(ctx, client, sprites, conf, size) {
    this.ctx = ctx;
    this.match = conf.match;
    this.size = size;

    /** @type {Match} */
    this.match = copy(this.match, {
      world: copy(this.match.world, {
        authoritative: false
      }),
    });

    this.client = client;

    this.id = conf.id;

    this.renderers = [
      stoneRenderer(ctx, this, sprites),
      brickRenderer(ctx, this, sprites),
      waterRenderer(ctx, this, sprites),
      bulletRenderer(ctx, this, sprites),
      tankRenderer(ctx, this, sprites),
      jungleRenderer(ctx, this, sprites),
      explosionsRenderer(ctx, this, sprites),

      spawnInRenderer(
        ctx,
        this,
        s => Point.create(s.pixelWidth / 2, s.pixelHeight / 2)
      ),
      matchStateRenderer(
        ctx,
        this,
        s => Point.create(s.pixelWidth / 2, s.pixelHeight / 2)
      ),
      thisIsYouRenderer(ctx, this),

      renderer.ui_bg_renderer(ctx, this.size),

      textRenderer(
        ctx,
        s => Point.create(s.uiX + s.unit / 2, s.unit / 2),
        this.size,
        Direction.Direction.DOWN,
        [
          matchTimeTextProvider(this),
          emptyTextProvider,
          scoreTextProvider(this)
        ]
      ),

      textRenderer(
        ctx,
        s => Point.create(s.uiX + s.unit / 2, s.pixelHeight),
        this.size,
        Direction.Direction.UP,
        [
          pingTextProvider(client),
          fpsTextProvider(),
          tickTextProvider(this),
          unackedInputTextProvider(this),
          netUsageRenderer(this.client),
          unitSizeTextProvider(this),
          positionTextRenderer(this),
        ]
      )
    ];

    this.moving = false;
    this.direction = null;
    this.moveId = 0;
  }

  update(event) {
    event.tick = this.match.tick;

    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.strokeStyle = 'black';
    this.ctx.strokeRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    if (this.moving) {
      const move = TankMove.create(increaseTick(this.moveId, val => this.moveId = val), this.direction);
      this.handleEvent(NetMessage(
        this.id,
        MessageType.MOVE,
        move
      ));
    }

    for (let renderer of this.renderers) {
      renderer(event);
    }
  }

  startMoving(direction) {
    if (this.moving && this.direction === direction) {
      return;
    }

    this.moving = true;
    this.direction = direction;
  }

  stopMoving() {
    this.moving = false;
    this.direction = null;
  }

  shoot() {
    const tank = World.findTank(this.match.world, this.id);
    if (!tank) {
      return;
    }
    this.handleEvent(NetMessage(
      this.id,
      MessageType.SHOOT,
      TankMove.create(increaseTick(this.moveId, val => this.moveId = val), tank.direction)
    ));
  }

  handleEvent(netMessage) {
    const updates = [];
    this.match = Match.handleEvent(this.match, netMessage, updates);
    if (updates.length > 0) {
      Client.sendNetMessage(this.client, netMessage);
      this.match = Match.addUnackedMessage(this.match, netMessage);
      return true;
    }
    return false;
  }

  onSync(tickData) {
    this.match = Match.sync(this.match, this.id, tickData);
  }

  stop() {
  }

  resize(size) {
    for (let key of Object.keys(size)) {
      this.size[key] = size[key];
    }
  }

  ownPosition() {
    const tank = World.findTank(this.match.world, this.id);
    if (tank) {
      return tank.position;
    }

    return null;
  }

}
