import {createGameLoopResult} from '@Client/tanks/client/game/gameLoop.js';
import uiBgRenderer from '@Client/tanks/client/game/renderer/uiBgRenderer.js';
import Direction from '@Lib/tanks/lib/data/primitives/Direction.js';
import Match from '@Lib/tanks/lib/data/Match.js';
import Point from '@Lib/tanks/lib/data/primitives/Point.js';
import World from '@Lib/tanks/lib/data/World.js';
import TankMove from '@Lib/tanks/lib/event/TankMove.js';
import MessageType from '@Lib/tanks/lib/proto/MessageType.js';
import NetMessage from '@Lib/tanks/lib/proto/NetMessage.js';
import immutable from '@Lib/tanks/lib/util/immutable.js';
import increaseTick from '@Lib/tanks/lib/util/increaseTick.js';
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

import returnResult from '@Lib/tanks/lib/data/returnResult.js';

export default class Game {

  constructor(ctx, client, sprites, conf, size, input) {
    this.ctx = ctx;
    this.match = conf.match;
    this.size = size;

    /** @type {Match} */
    this.match = immutable.copy(this.match, {
      world: immutable.copy(this.match.world, {
        authoritative: false
      }),
    });

    this.client = client;

    this.id = conf.id;

    this.input = input;

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


      uiBgRenderer(ctx, this.size),

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

    this.moveId = 0;
  }

  render(event) {
    const ctx = this.ctx;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.strokeStyle = 'black';
    ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (let renderer of this.renderers) {
      renderer(event);
    }
  }

  update(gameLoopInput) {
    let {
      event,
      input,
      networkInput,
      match,
      id
    } = gameLoopInput;

    event.tick = match.tick;

    const netMessages = [];
    if (input.movingDirection) {
      const move = TankMove.create(
        increaseTick(this.moveId, val => this.moveId = val),
        input.movingDirection
      );
      const netMessage = NetMessage(id, MessageType.MOVE, move);
      const result = this.handleEvent(match, netMessage);
      if (returnResult.isSuccessful(result)) {
        netMessages.push(netMessage);
      }
      match = returnResult.getResult(result);
    }

    if (input.shooting) {
      const result = this.shoot(match, netMessages, id);
      if (returnResult.isSuccessful(result)) {
        match = returnResult.getResult(result);
      }
    }

    for (let tickData of networkInput) {
      match = Match.sync(match, id, tickData);
    }

    return createGameLoopResult(match, netMessages);
  }

  shoot(match, netMessages, id) {
    const tank = World.findTank(match.world, id);
    if (!tank) {
      return returnResult.modifiedUnsuccessfully(match);
    }
    const netMessage = NetMessage(
      id,
      MessageType.SHOOT,
      TankMove.create(increaseTick(this.moveId, val => this.moveId = val), tank.direction)
    );
    const result = this.handleEvent(match, netMessage);
    if (returnResult.isSuccessful(result)) {
      netMessages.push(netMessage);
    }
    return result;
  }

  handleEvent(match, netMessage) {
    const updates = [];
    const result = Match.handleEvent(match, netMessage, updates);
    match = returnResult.getResult(result);
    if (returnResult.isSuccessful(result)) {
      match = Match.addUnackedMessage(match, netMessage);
      return returnResult.modifiedSuccessfully(match);
    }
    return returnResult.modifiedUnsuccessfully(match);
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
