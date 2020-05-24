import Direction from '../../../lib/src/Direction.js';
import Tank from '../../../lib/src/Tank.js';
import World from '../../../lib/src/World.js';
import BrickRenderer from './blocks/BrickRenderer.js';
import JungleRenderer from './blocks/JungleRenderer.js';
import StoneRenderer from './blocks/StoneRenderer.js';
import WaterRenderer from './blocks/WaterRenderer.js';
import PingRenderer from './PingRenderer.js';
import TankRenderer from './TankRenderer.js';

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

  update(canvas, event) {
    canvas.fillStyle = 'white';
    canvas.fillRect(0, 0, canvas.canvas.width, canvas.canvas.height);

    canvas.strokeStyle = 'black';
    canvas.strokeRect(0, 0, canvas.canvas.width, canvas.canvas.height);

    this.ticks.forEach(tick => tick.update(canvas, event));
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
    this.tank.move(direction);
    this.client.move(direction);
  }

  onMove(tankMove) {
    this.world.findTank(tankMove.id).move(tankMove.direction);
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
