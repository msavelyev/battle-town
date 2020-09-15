import TankMove from '../../../lib/src/event/TankMove.js';
import BrickRenderer from './renderer/blocks/BrickRenderer.js';
import JungleRenderer from './renderer/blocks/JungleRenderer.js';
import StoneRenderer from './renderer/blocks/StoneRenderer.js';
import WaterRenderer from './renderer/blocks/WaterRenderer.js';
import BulletRenderer from './renderer/BulletRenderer.js';
import PingRenderer from './renderer/PingRenderer.js';
import TankRenderer from './renderer/TankRenderer.js';
import FpsRenderer from './renderer/FpsRenderer.js';
import ScoreRenderer from './renderer/ScoreRenderer.js';
import NetMessage from '../../../lib/src/proto/NetMessage.js';
import MessageType from '../../../lib/src/proto/MessageType.js';
import increaseTick from '../../../lib/src/util/increaseTick.js';
import Point from '../../../lib/src/data/Point.js';
import {OFFSET_Y} from './renderer/text.js';
import Match from '../../../lib/src/data/Match.js';
import World from '../../../lib/src/data/World.js';
import MatchStateRenderer from './renderer/MatchStateRenderer.js';
import ExplosionsRenderer from './renderer/ExplosionsRenderer.js';

export default class Game {

  constructor(ctx, client, sprites, conf) {
    this.ctx = ctx;
    this.match = conf.match;

    const world = this.match.world;
    world.authoritative = false;

    this.client = client;

    this.id = conf.id;

    this.ticks = [
      {
        update: event => {
          Match.update(this.match, event)
        }
      },
      new StoneRenderer(ctx, world, sprites),
      new BrickRenderer(ctx, world, sprites),
      new WaterRenderer(ctx, world, sprites),
      new BulletRenderer(ctx, world, sprites),
      new TankRenderer(ctx, this.id, world, sprites),
      new JungleRenderer(ctx, world, sprites),
      new PingRenderer(ctx, new Point(world.width, world.height - 3), this.client),
      new FpsRenderer(ctx, new Point(world.width, world.height - 3 - OFFSET_Y)),
      new ScoreRenderer(ctx, this.match, new Point(world.width, 12)),
      // new TickRenderer(
      //   ctx,
      //   this.match,
      //   this.client,
      //   new Point(world.width, world.height - 3 - OFFSET_Y * 2)
      // ),
      new MatchStateRenderer(ctx, this.match, new Point(world.width / 2, world.height / 2)),
      new ExplosionsRenderer(ctx, world, sprites)
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
      const move = new TankMove(increaseTick(this.moveId, val => this.moveId = val), this.direction);
      this.handleEvent(new NetMessage(
        this.id,
        this.match.tick,
        MessageType.MOVE,
        move
      ));
    }

    for (let tick of this.ticks) {
      tick.update(event);
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
    this.handleEvent(new NetMessage(
      this.id,
      this.match.tick,
      MessageType.SHOOT,
      new TankMove(increaseTick(this.moveId, val => this.moveId = val), tank.direction)
    ));
  }

  handleEvent(netMessage) {
    if (Match.handleEvent(this.match, netMessage)) {
      this.client.sendNetMessage(netMessage);
      Match.addUnackedMessage(this.match, netMessage);
      return true;
    }
    return false;
  }

  onSync(data) {
    Match.sync(this.match, this.id, data);
  }

  stop() {
  }

}
