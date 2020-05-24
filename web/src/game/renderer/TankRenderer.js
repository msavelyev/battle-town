import Direction from '../../../../lib/src/Direction.js';
import Tank from '../../../../lib/src/Tank.js';

export default class TankRenderer {

  constructor(world) {
    this.world = world;
  }

  update(ctx, event) {
    this.world.tanks.forEach(tank => this.updateTank(ctx, event, tank));
  }

  updateTank(ctx, event, tank) {
    this.drawTank(ctx, tank);
  }

  drawTank(ctx, tank) {
    const x = tank.position.x;
    const y = tank.position.y;

    ctx.fillStyle = tank.color;
    ctx.setTransform(1, 0, 0, 1, x * Tank.SIZE, y * Tank.SIZE);
    ctx.transform(1, 0, 0, 1, Tank.SIZE / 2, Tank.SIZE / 2);
    ctx.rotate(this.directionToAngle(tank.direction) * Math.PI / 180);
    ctx.transform(1, 0, 0, 1, -Tank.SIZE / 2, -Tank.SIZE / 2);
    ctx.beginPath();

    const a = Tank.SIZE;
    ctx.moveTo(a/2, 0);
    ctx.lineTo(a - a/10, a);
    ctx.lineTo(a/10, a);
    ctx.lineTo(a/2, 0);
    ctx.fill();

    ctx.strokeStyle = 'black';
    ctx.strokeRect(
      0,
      0,
      Tank.SIZE,
      Tank.SIZE
    );

    ctx.resetTransform();
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
