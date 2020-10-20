import * as dotenv from '@Lib/tanks/lib/util/dotenv.js';
import helper from '@Client/tanks/client/game/renderer/helper.js';
import * as sprites from '@Client/tanks/client/game/renderer/sprites.js';
import {SPRITES} from '@Client/tanks/client/game/renderer/sprites.js';

export default function(ctx, game, spritesConf) {
  return event => {
    for (let explosion of game.match.world.explosions) {
      const gameSize = game.size;
      const position = helper.offset(explosion.position, game.ownPosition());

      if (helper.outsideVisibleBoundaries(position)) {
        continue;
      }

      const x = position.x;
      const y = position.y;
      const size = explosion.size * gameSize.unit;
      ctx.setTransform(1, 0, 0, 1, x * gameSize.unit, y * gameSize.unit);
      sprites.draw(
        ctx,
        event.tick,
        spritesConf[gameSize.unit][SPRITES.EXPLOSION],
        0,
        0,
        size,
        size,
        explosion.tick
      );

      if (dotenv.SETTINGS.DEBUG_RENDER) {
        ctx.strokeStyle = 'orange';
        ctx.strokeRect(
          0,
          0,
          size,
          size
        );
      }

      ctx.resetTransform();
    }
  };

}
