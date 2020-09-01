import Entity from '../../../../lib/src/Entity.js';
import sprites from './Sprites.js';

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
    const size = bullet.size * Entity.BLOCK_SIZE;

    ctx.fillStyle = 'white';
    ctx.setTransform(1, 0, 0, 1, x * Entity.BLOCK_SIZE, y * Entity.BLOCK_SIZE);
    ctx.transform(1, 0, 0, 1, size / 2, size / 2);

    ctx.rotate(bullet.direction.angle * Math.PI / 180);
    ctx.transform(1, 0, 0, 1, - size / 2, - size / 2);
    ctx.drawImage(
      sprites.bullet,
      0, 0,
      sprites.bullet.width,
      sprites.bullet.height,
      Math.ceil((size - sprites.bullet.width) / 2),
      Math.ceil((size - sprites.bullet.height) / 2),
      sprites.bullet.width,
      sprites.bullet.height
    );

    ctx.resetTransform();
  }

}
