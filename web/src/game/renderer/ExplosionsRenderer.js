import {SETTINGS} from '../../../../lib/src/util/dotenv.js';
import helper from './helper.js';
import {SPRITES} from './sprites.js';
import * as sprites from './sprites.js';

export default class ExplosionsRenderer {

  constructor(ctx, game, sprites) {
    this.ctx = ctx;
    this.game = game;
    this.sprites = sprites;
  }

  update(event) {
    for (let explosion of this.game.match.world.explosions) {
      const gameSize = this.game.size;
      const position = helper.offset(explosion.position, this.game.ownPosition());

      if (helper.outsideVisibleBoundaries(position)) {
        continue;
      }

      const x = position.x;
      const y = position.y;
      const size = explosion.size * gameSize.unit;
      this.ctx.setTransform(1, 0, 0, 1, x * gameSize.unit, y * gameSize.unit);
      sprites.draw(
        this.ctx,
        event.tick,
        this.sprites[gameSize.unit][SPRITES.EXPLOSION],
        0,
        0,
        size,
        size,
        explosion.tick
      );

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

}
