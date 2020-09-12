import Entity from '../../../../lib/src/data/Entity.js';
import Direction from '../../../../lib/src/data/Direction.js';
import Sprites from './Sprites.js';

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
    const x = bullet.entity.position.x;
    const y = bullet.entity.position.y;
    const size = bullet.entity.size * Entity.BLOCK_SIZE;
    const img = this.sprites.bullet;

    ctx.fillStyle = 'white';
    ctx.setTransform(1, 0, 0, 1, x * Entity.BLOCK_SIZE, y * Entity.BLOCK_SIZE);
    ctx.transform(1, 0, 0, 1, size / 2, size / 2);

    ctx.rotate(Direction.angle(bullet.direction) * Math.PI / 180);
    ctx.transform(1, 0, 0, 1, - size / 2, - size / 2);
    Sprites.draw(ctx, img, Math.ceil((size - img.w) / 2), Math.ceil((size - img.h) / 2));

    ctx.resetTransform();
  }

}
