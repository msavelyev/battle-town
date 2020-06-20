import Direction from '../../../../lib/src/Direction.js';
import Tank from '../../../../lib/src/Tank.js';

export default class BulletRenderer {

  constructor(ctx, world) {
    this.ctx = ctx;
    this.world = world;
  }

  update() {
    this.world.bullets.forEach(bullet => this.drawBullet(this.ctx, bullet));
  }

  drawBullet(ctx, bullet) {
    const x = bullet.position.x;
    const y = bullet.position.y;

    ctx.fillStyle = 'black';
    ctx.setTransform(1, 0, 0, 1, x * Tank.SIZE, y * Tank.SIZE);
    ctx.beginPath();

    const a = Tank.SIZE;
    ctx.moveTo(a/2 - 5, a/2 - 5);
    ctx.lineTo(a/2 - 5, a/2 + 5);
    ctx.lineTo(a/2 + 5, a/2 + 5);
    ctx.lineTo(a/2 + 5, a/2 - 5);
    ctx.lineTo(a/2 - 5, a/2 - 5);
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
