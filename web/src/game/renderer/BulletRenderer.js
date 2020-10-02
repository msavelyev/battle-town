import * as Bullet from '../../../../lib/src/data/Bullet.js';
import * as Direction from '../../../../lib/src/data/Direction.js';
import {SETTINGS} from '../../../../lib/src/util/dotenv.js';
import Sprites from './Sprites.js';

export default class BulletRenderer {

  constructor(ctx, world, sprites, size) {
    this.ctx = ctx;
    this.world = world;
    this.sprites = sprites;
    this.size = size;
  }

  update() {
    this.world.bullets.forEach(bullet => this.drawBullet(this.ctx, bullet));
  }

  drawBullet(ctx, bullet) {
    const x = bullet.position.x;
    const y = bullet.position.y;
    const width = bullet.width * this.size.unit;
    const height = bullet.height * this.size.unit
    const img = this.sprites.bullet;
    const size = Bullet.size() / 2 * this.size.unit;

    ctx.fillStyle = 'white';
    ctx.setTransform(1, 0, 0, 1, x * this.size.unit, y * this.size.unit);
    ctx.transform(1, 0, 0, 1, width / 2, height / 2);
    ctx.rotate(Direction.toRad(bullet.direction));
    ctx.transform(1, 0, 0, 1, - width / 2, - height / 2);
    Sprites.draw(
      ctx,
      img,
      Math.ceil((width - size) / 2),
      Math.ceil((height - size) / 2),
      size,
      size
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
