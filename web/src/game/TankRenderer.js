import Direction from '../../../lib/src/Direction.js';
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
    canvas.setTransform(1, 0, 0, 1, x, y);
    canvas.transform(1, 0, 0, 1, Tank.SIZE / 2, Tank.SIZE / 2);
    canvas.rotate(this.directionToAngle(tank.direction) * Math.PI / 180);
    canvas.transform(1, 0, 0, 1, -Tank.SIZE / 2, -Tank.SIZE / 2);
    canvas.beginPath();

    const a = Tank.SIZE;
    canvas.moveTo(a/2, 0);
    canvas.lineTo(a - a/10, a);
    canvas.lineTo(a/10, a);
    canvas.lineTo(a/2, 0);
    canvas.fill();

    canvas.resetTransform();
  }

  directionToAngle(direction) {
    switch (direction) {
      case Direction.UP:
        return 0;
      case Direction.RIGHT:
        return 90;
      case Direction.DOWN:
        return 180;
      case Direction.LEFT:
        return 270;
      default:
        throw new Error('Unknown direction ' + direction);
    }
  }

}
