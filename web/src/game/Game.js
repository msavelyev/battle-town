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
      new PingRenderer(ctx, this.client),
      new FpsRenderer(ctx),
      new ScoreRenderer(ctx, this.world),
      new TickRenderer(ctx, this.world, this.client)
    ];

    this.moveId = 0;
  }

  update(event) {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.strokeStyle = 'black';
    this.ctx.strokeRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ticks.forEach(tick => tick.update(event));
  }

  startMoving(direction) {
    const tank = this.world.findTank(this.id);
    if (tank.moving && tank.direction.eq(direction)) {
      return;
    }
    this.handleEvent(new NetMessage(
      this.id,
      this.world.tick,
      MessageType.START_MOVING,
      new TankMove(this.moveId++, direction, tank.position)
    ));
  }

  stopMoving() {
    const tank = this.world.findTank(this.id);
    this.handleEvent(new NetMessage(
      this.id,
      this.world.tick,
      MessageType.STOP_MOVING,
      new TankMove(this.moveId++, tank.direction, tank.position)
    ));
  }

  shoot() {
    const tank = this.world.findTank(this.id);
    this.handleEvent(new NetMessage(
      this.id,
      this.world.tick,
      MessageType.SHOOT,
      new TankMove(this.moveId++, tank.direction, tank.position)
    ));
  }

  handleEvent(netMessage) {
    if (this.world.handleEvent(netMessage)) {
      this.world.lastMove = netMessage.data.moveId;
      this.client.send(netMessage);
    }
  }

  onSync(data) {
    const newWorld = World.create(data);
    this.world.sync(this.id, newWorld);
  }

  stop() {
  }

}
