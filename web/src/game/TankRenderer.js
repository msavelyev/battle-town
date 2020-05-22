import Tank from '../../../lib/src/Tank.js';

export default class TankRenderer {

  constructor(world) {
    this.world = world;
  }

  update(canvas, event) {
    this.world.tanks.forEach(tank => this.updateTank(canvas, event, tank));
  }

  updateTank(canvas, event, tank) {
    canvas.fillStyle = tank.color;
    canvas.fillRect(
      tank.position.x,
      tank.position.y,
      Tank.SIZE,
      Tank.SIZE
    );

    canvas.strokeStyle = 'black';
    canvas.strokeRect(
      tank.position.x,
      tank.position.y,
      Tank.SIZE,
      Tank.SIZE
    );
  }

}
