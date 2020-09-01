import BlockType from '../../../../../lib/src/BlockType.js';
import BlockRenderer from './BlockRenderer.js';
import sprites from '../Sprites.js';

export default class StoneRenderer extends BlockRenderer {

  constructor(ctx, world) {
    super(ctx, world, BlockType.STONE, sprites.stone);
  }

}
