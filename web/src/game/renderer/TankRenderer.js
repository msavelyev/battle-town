import Direction from '../../../../lib/src/Direction.js';
import Entity from '../../../../lib/src/Entity.js';

export default class TankRenderer {

  constructor(ctx, world) {
    this.ctx = ctx;
    this.world = world;
  }

  update(event) {
    this.world.tanks.forEach(tank => this.updateTank(this.ctx, event, tank));
  }

  updateTank(ctx, event, tank) {
    this.drawTank(ctx, tank);
  }

  drawTank(ctx, tank) {
    const x = tank.position.x;
    const y = tank.position.y;
    const size = tank.getSize() * Entity.BLOCK_SIZE;

    ctx.fillStyle = tank.color;
    ctx.setTransform(1, 0, 0, 1, x * Entity.BLOCK_SIZE, y * Entity.BLOCK_SIZE);
    ctx.transform(1, 0, 0, 1, size / 2, size / 2);

    ctx.textAlign = 'center';
    ctx.font = '8pt Helvetica'
    ctx.fillText(tank.id.substr(0, 8), 0, -20);
    ctx.textAlign = 'left';

    ctx.rotate(this.directionToAngle(tank.direction) * Math.PI / 180);
    ctx.transform(1, 0, 0, 1, -size / 2, -size / 2);
    ctx.beginPath();

    const a = size;
    ctx.moveTo(a/2, 0);
    ctx.lineTo(a - a/10, a);
    ctx.lineTo(a/10, a);
    ctx.lineTo(a/2, 0);
    ctx.fill();

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
