import TankMove from '../../../lib/src/event/TankMove.js';
import World from '../../../lib/src/World.js';
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
import TickRenderer from './renderer/TickRenderer.js';
import increaseTick from '../../../lib/src/util/increaseTick.js';
import Point from '../../../lib/src/Point.js';
import {OFFSET_Y} from './renderer/text.js';

export default class Game {

  constructor(ctx, client, sprites, conf) {
    this.ctx = ctx;
    this.world = World.create(conf.world);
    this.world.authoritative = false;
    this.client = client;

    this.id = conf.id;

    this.ticks = [
      this.world,
      new StoneRenderer(ctx, this.world, sprites),
      new BrickRenderer(ctx, this.world, sprites),
      new WaterRenderer(ctx, this.world, sprites),
      new BulletRenderer(ctx, this.world, sprites),
      new TankRenderer(ctx, this.world, sprites),
      new JungleRenderer(ctx, this.world, sprites),
      new PingRenderer(ctx, new Point(this.world.width, this.world.height - 3), this.client),
      new FpsRenderer(ctx, new Point(this.world.width, this.world.height - 3 - OFFSET_Y)),
      new ScoreRenderer(ctx, this.world, new Point(this.world.width, 12)),
      new TickRenderer(
        ctx,
        this.world,
        this.client,
        new Point(this.world.width, this.world.height - 3 - OFFSET_Y * 2)
      )
    ];

    this.moving = false;
    this.direction = null;
    this.moveId = 0;
  }

  update(event) {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.strokeStyle = 'black';
    this.ctx.strokeRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    if (this.moving) {
      const move = new TankMove(increaseTick(this.moveId, val => this.moveId = val), this.direction);
      this.handleEvent(new NetMessage(
        this.id,
        this.world.tick,
        MessageType.MOVE,
        move
      ));
    }

    this.ticks.forEach(tick => tick.update(event));
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
    const tank = this.world.findTank(this.id);
    this.handleEvent(new NetMessage(
      this.id,
      this.world.tick,
      MessageType.SHOOT,
      new TankMove(increaseTick(this.moveId, val => this.moveId = val), tank.direction)
    ));
  }

  handleEvent(netMessage) {
    if (this.world.handleEvent(netMessage)) {
      this.client.send(netMessage);
      this.world.addUnackedMessage(netMessage);
      return true;
    }
    return false;
  }

  onSync(data) {
    this.world.sync(this.id, data);
  }

  stop() {
  }

}
