import Tank from '../../../lib/src/Tank.js';
import World from '../../../lib/src/World.js';
import TankRenderer from  './TankRenderer.js';
import Point from '../../../lib/src/Point.js';
import Direction from '../../../lib/src/Direction.js';

export default class Game {

  constructor(client, conf) {
    this.world = new World(conf.width, conf.height);
    this.client = client;

    conf.tanks.forEach(tank => this.world.addTank(Tank.create(tank)));

    this.tank = Tank.create(conf.tank);
    this.world.addTank(this.tank);

    this.ticks = [
      new TankRenderer(this.world)
    ];
  }

  update(canvas, event) {
    canvas.fillStyle = 'white';
    canvas.fillRect(0, 0, this.world.width, this.world.height);

    canvas.strokeStyle = 'black';
    canvas.strokeRect(0, 0, this.world.width, this.world.height);

    this.ticks.forEach(tick => tick.update(canvas, event));
  }

  onkey(event) {
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

}
