import Direction from '../../../lib/src/Direction.js';
import Tank from '../../../lib/src/Tank.js';
import TankMove from '../../../lib/src/TankMove.js';
import World from '../../../lib/src/World.js';
import BrickRenderer from './renderer/blocks/BrickRenderer.js';
import JungleRenderer from './renderer/blocks/JungleRenderer.js';
import StoneRenderer from './renderer/blocks/StoneRenderer.js';
import WaterRenderer from './renderer/blocks/WaterRenderer.js';
import BulletRenderer from './renderer/BulletRenderer.js';
import PingRenderer from './renderer/PingRenderer.js';
import TankRenderer from './renderer/TankRenderer.js';

export default class Game {

  constructor(ctx, client, conf) {
    this.ctx = ctx;
    this.world = World.create(conf.world);
    this.client = client;

    this.tank = Tank.create(conf.tank);
    this.world.addTank(this.tank);

    this.ticks = [
      this.world,
      new TankRenderer(ctx, this.world),
      new StoneRenderer(ctx, this.world),
      new BrickRenderer(ctx, this.world),
      new WaterRenderer(ctx, this.world),
      new JungleRenderer(ctx, this.world),
      new BulletRenderer(ctx, this.world),
      new PingRenderer(ctx, this.client)
    ];
  }

  update(event) {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.strokeStyle = 'black';
    this.ctx.strokeRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ticks.forEach(tick => tick.update(event));
  }

  keydown(event) {
    switch (event.code) {
      case 'ArrowUp':
        this.move(Direction.UP);
        break;
      case 'ArrowDown':
        this.move(Direction.DOWN);
        break;
      case 'ArrowLeft':
        this.move(Direction.LEFT);
        break;
      case 'ArrowRight':
        this.move(Direction.RIGHT);
        break;
      case 'Space':
        this.shoot();
        break;
    }
  }

  move(direction) {
    this.onMove(new TankMove(this.tank.id, direction));
    this.client.move(direction);
  }

  onMove(tankMove) {
    this.world.moveTank(tankMove.id, tankMove.direction);
  }

  shoot() {
    this.onShoot(this.tank.id);
    this.client.shoot();
  }

  onShoot(id) {
    this.world.shoot(id);
  }

  onConnected(tank) {
    this.world.addTank(Tank.create(tank));
  }

  onDisconnected(id) {
    this.world.removeTank(id);
  }

  stop() {
  }

}
