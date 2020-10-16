import BlockType from '@Lib/tanks/lib/data/entity/BlockType.js';
import {SPRITES} from '@Client/tanks/client/game/renderer/sprites.js';
import blockRenderer from '@Client/tanks/client/game/renderer/blocks/blockRenderer.js';

function findImage(block) {
  const subtype = block.subtype;
  switch (subtype) {
    case BlockType.BRICK_TL:
      return SPRITES.BRICK_TL;
    case BlockType.BRICK_TR:
      return SPRITES.BRICK_TR;
    case BlockType.BRICK_BL:
      return SPRITES.BRICK_BL;
    case BlockType.BRICK_BR:
      return SPRITES.BRICK_BR;
    default:
      throw new Error('Unknown subtype ' + subtype);
  }
}

export default function(ctx, game, sprites) {
  return blockRenderer(ctx, game, BlockType.BRICK, sprites, findImage)
}
