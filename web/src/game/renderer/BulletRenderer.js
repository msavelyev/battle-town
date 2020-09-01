import Direction from '../../../../lib/src/Direction.js';
import Entity from '../../../../lib/src/Entity.js';

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
    const size = bullet.getSize() * Entity.BLOCK_SIZE;

    ctx.fillStyle = 'white';
    ctx.setTransform(1, 0, 0, 1, x * Entity.BLOCK_SIZE, y * Entity.BLOCK_SIZE);
    ctx.beginPath();

    const a = size;
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
