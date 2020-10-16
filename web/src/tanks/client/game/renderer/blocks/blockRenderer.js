import {EntityState} from '../../../../../../../lib/src/tanks/lib/data/entity/EntityState.js';
import helper from '../helper.js';
import * as sprites from '../sprites.js';


function drawBlock(game, spritesConf, spriteName, ctx, block, event) {
  const gameSize = game.size;
  const size = block.size * gameSize.unit;

  const position = helper.offset(block.position, game.ownPosition());

  if (helper.outsideVisibleBoundaries(position)) {
    return;
  }

  ctx.setTransform(1, 0, 0, 1, position.x * gameSize.unit, position.y * gameSize.unit);
  if (block.state === EntityState.REVIVING) {
    ctx.globalAlpha = 0.5;
  }

  let draw = true;
  if (block.state === EntityState.REVIVING) {
    if (Math.ceil(event.tick / 15) % 2 !== 0) {
      draw = false;
    }
  }

  if (draw) {
    sprites.draw(ctx, event.tick, spritesConf[gameSize.unit][spriteName], 0, 0, size, size);
  }
  ctx.globalAlpha = 1;
  ctx.resetTransform();
}

function update(game, spritesConf, type, ctx, event, blockToSprite) {
  for (let block of game.match.world.blocks) {
    if (block.state === EntityState.DEAD) {
      continue;
    }

    if (block.type === type) {
      const spriteName = blockToSprite instanceof Function ? blockToSprite(block) : blockToSprite;
      drawBlock(game, spritesConf, spriteName, ctx, block, event);
    }
  }
}

export default function(ctx, game, type, spritesConf, blockToSprite) {
  return event => {
    update(game, spritesConf, type, ctx, event, blockToSprite);
  }
}
