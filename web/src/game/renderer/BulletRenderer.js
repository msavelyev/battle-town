import * as Bullet from '../../../../lib/src/data/entity/Bullet.js';
import * as Direction from '../../../../lib/src/data/primitives/Direction.js';
import {SETTINGS} from '../../../../lib/src/util/dotenv.js';
import Sprites from './Sprites.js';

export default class BulletRenderer {

  constructor(ctx, game, sprites) {
    this.ctx = ctx;
    this.game = game;
    this.sprites = sprites;
  }

  update() {
    for (let bullet of this.game.match.world.bullets) {
      this.drawBullet(this.ctx, bullet);
    }
  }

  drawBullet(ctx, bullet) {
    const gameSize = this.game.size;
    const x = bullet.position.x;
    const y = bullet.position.y;
    const width = bullet.width * gameSize.unit;
    const height = bullet.height * gameSize.unit
    const img = this.sprites.bullet;
    const size = Bullet.size() / 2 * gameSize.unit;

    ctx.fillStyle = 'white';
    ctx.setTransform(1, 0, 0, 1, x * gameSize.unit, y * gameSize.unit);
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
