import BlockType from '../../../../../lib/src/data/BlockType.js';
import BlockRenderer from './BlockRenderer.js';

export default class BrickRenderer extends BlockRenderer {

  constructor(ctx, world, sprites) {
    super(ctx, world, BlockType.BRICK, sprites.brick);
  }

}
