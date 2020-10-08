import {SETTINGS} from '../../../../lib/src/util/dotenv.js';
import Sprites from './Sprites.js';

export default class ExplosionsRenderer {

  constructor(ctx, game, sprites) {
    this.ctx = ctx;
    this.game = game;
    this.sprites = sprites;
  }

  update(event) {
    for (let explosion of this.game.match.world.explosions) {
      const image = this.pickImage(explosion, event);

      if (!image) {
        continue;
      }

      const gameSize = this.game.size;
      const x = explosion.position.x;
      const y = explosion.position.y;
      const size = explosion.size * gameSize.unit;
      this.ctx.setTransform(1, 0, 0, 1, x * gameSize.unit, y * gameSize.unit);
      Sprites.draw(this.ctx, image, 0, 0, size, size);

      if (SETTINGS.DEBUG_RENDER) {
        this.ctx.strokeStyle = 'orange';
        this.ctx.strokeRect(
          0,
          0,
          size,
          size
        );
      }

      this.ctx.resetTransform();
    }
  }

  pickImage(explosion, event) {
    const tick = event.tick;
    const startTick = explosion.tick;

    const frame = Math.ceil((tick - startTick) / 10);
    switch (frame) {
      case 1:
        return this.sprites.explosion1;
      case 2:
        return this.sprites.explosion2;
      case 3:
        return this.sprites.explosion3;
      default:
        return null;
    }
  }

}
