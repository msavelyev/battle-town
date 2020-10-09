import { BlockType } from '../../../../../lib/src/data/entity/BlockType.js';
import {SPRITES} from '../sprites.js';
import BlockRenderer from './BlockRenderer.js';

function findImage(subtype) {
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

export default class BrickRenderer extends BlockRenderer {

  constructor(ctx, game, sprites) {
    super(ctx, game, BlockType.BRICK, sprites, SPRITES.BRICK);
  }

  drawBlock(ctx, block, event) {
    this.spriteName = findImage(block.subtype);

    super.drawBlock(ctx, block, event);
  }

}
