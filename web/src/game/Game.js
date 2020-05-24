import Direction from '../../../lib/src/Direction.js';
import Tank from '../../../lib/src/Tank.js';
import TankMove from '../../../lib/src/TankMove.js';
import World from '../../../lib/src/World.js';
import BrickRenderer from './renderer/blocks/BrickRenderer.js';
import JungleRenderer from './renderer/blocks/JungleRenderer.js';
import StoneRenderer from './renderer/blocks/StoneRenderer.js';
import WaterRenderer from './renderer/blocks/WaterRenderer.js';
import PingRenderer from './renderer/PingRenderer.js';
import TankRenderer from './renderer/TankRenderer.js';

export default class Game {

  constructor(client, conf) {
    this.world = World.create(conf.world);
    this.client = client;

    this.tank = Tank.create(conf.tank);
    this.world.addTank(this.tank);

    this.pingRenderer = new PingRenderer(this.client);

    this.ticks = [
      new TankRenderer(this.world),
      new StoneRenderer(this.world),
      new BrickRenderer(this.world),
      new WaterRenderer(this.world),
      new JungleRenderer(this.world),
      this.pingRenderer
    ];
  }

  update(ctx, event) {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.strokeStyle = 'black';
    ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    this.ticks.forEach(tick => tick.update(ctx, event));
  }

  keydown(event) {
    switch (event.key) {
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
    }
  }

  move(direction) {
    this.onMove(new TankMove(this.tank.id, direction));
    this.client.move(direction);
  }

  onMove(tankMove) {
    this.world.moveTank(tankMove.id, tankMove.direction);
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
