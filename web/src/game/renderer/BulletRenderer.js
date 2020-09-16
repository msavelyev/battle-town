import Entity from '../../../../lib/src/data/Entity.js';
import Direction from '../../../../lib/src/data/Direction.js';
import {SETTINGS} from '../../../../lib/src/util/dotenv.js';
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
    const x = bullet.position.x;
    const y = bullet.position.y;
    const width = bullet.width * Entity.BLOCK_SIZE;
    const height = bullet.height * Entity.BLOCK_SIZE
    const img = this.sprites.bullet;

    ctx.fillStyle = 'white';
    ctx.setTransform(1, 0, 0, 1, x * Entity.BLOCK_SIZE, y * Entity.BLOCK_SIZE);
    ctx.transform(1, 0, 0, 1, width / 2, height / 2);
    ctx.rotate(Direction.toRad(bullet.direction));
    ctx.transform(1, 0, 0, 1, - width / 2, - height / 2);
    Sprites.draw(
      ctx,
      img,
      Math.ceil((width - img.w) / 2),
      Math.ceil((height - img.h) / 2),
      Math.min(width, height),
      Math.min(width, height)
    );

    if (SETTINGS.DEBUG_RENDER) {
      ctx.transform(1, 0, 0, 1, width / 2, height / 2);
      ctx.rotate(-Direction.toRad(bullet.direction));
      ctx.transform(1, 0, 0, 1, -width / 2, -height / 2);


      ctx.strokeStyle = '#0f0';
      ctx.strokeRect(
        0,
        0,
        width,
        height
      );
    }

    ctx.resetTransform();
  }

}
