import Tank from '../../../lib/src/Tank.js';

export default class TankRenderer {

  constructor(world) {
    this.world = world;
  }

  update(canvas, event) {
    this.world.tanks.forEach(tank => this.updateTank(canvas, event, tank));
  }

  updateTank(canvas, event, tank) {
    this.drawTank(canvas, tank);

    canvas.strokeStyle = 'black';
    canvas.strokeRect(
      tank.position.x,
      tank.position.y,
      Tank.SIZE,
      Tank.SIZE
    );
  }

  drawTank(canvas, tank) {
    const x = tank.position.x;
    const y = tank.position.y;

    canvas.fillStyle = tank.color;
    canvas.beginPath();
    canvas.moveTo(x, y);

    const a = Tank.SIZE;
    canvas.moveTo(x + a/2, y);
    canvas.lineTo(x + a - a/10, y + a);
    canvas.lineTo(x + a/10, y + a);
    canvas.lineTo(x + a/2, y);
    canvas.fill();
  }

}
