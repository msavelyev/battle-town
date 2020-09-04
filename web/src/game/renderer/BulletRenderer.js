import Entity from '../../../../lib/src/Entity.js';
import Direction from '../../../../lib/src/Direction.js';

export default class BulletRenderer {

  constructor(ctx, world, sprites) {
    this.ctx = ctx;
    this.world = world;
    this.sprites = sprites;
  }

  update() {
    this.world.bullets.forEach(bullet => this.drawBullet(this.ctx, bullet));
  }

  drawBullet(ctx, bullet) {
    const x = bullet.position.x;
    const y = bullet.position.y;
    const size = bullet.size * Entity.BLOCK_SIZE;
    const img = this.sprites.bullet;

    ctx.fillStyle = 'white';
    ctx.setTransform(1, 0, 0, 1, x * Entity.BLOCK_SIZE, y * Entity.BLOCK_SIZE);
    ctx.transform(1, 0, 0, 1, size / 2, size / 2);

    ctx.rotate(Direction.angle(bullet.direction) * Math.PI / 180);
    ctx.transform(1, 0, 0, 1, - size / 2, - size / 2);
    ctx.drawImage(
      img,
      0, 0,
      img.width,
      img.height,
      Math.ceil((size - img.width) / 2),
      Math.ceil((size - img.height) / 2),
      img.width,
      img.height
    );

    ctx.resetTransform();
  }

}
