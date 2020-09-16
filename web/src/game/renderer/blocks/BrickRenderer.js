import BlockType from '../../../../../lib/src/data/BlockType.js';
import BlockRenderer from './BlockRenderer.js';

function findImage(sprites, subtype) {
  switch (subtype) {
    case BlockType.BRICK_TL:
      return sprites.brick_tl;
    case BlockType.BRICK_TR:
      return sprites.brick_tr;
    case BlockType.BRICK_BL:
      return sprites.brick_bl;
    case BlockType.BRICK_BR:
      return sprites.brick_br;
    default:
      throw new Error('Unknown subtype ' + subtype);
  }
}

export default class BrickRenderer extends BlockRenderer {

  constructor(ctx, world, sprites) {
    super(ctx, world, BlockType.BRICK, sprites.brick);
    this.sprites = sprites;
  }

  drawBlock(ctx, block, event) {
    this.image = findImage(this.sprites, block.subtype);

    super.drawBlock(ctx, block, event);
  }

}
