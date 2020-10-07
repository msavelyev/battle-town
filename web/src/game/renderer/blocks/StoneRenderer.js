import { BlockType } from '../../../../../lib/src/data/entity/BlockType.js';
import BlockRenderer from './BlockRenderer.js';

export default class StoneRenderer extends BlockRenderer {

  constructor(ctx, world, sprites, size) {
    super(ctx, world, BlockType.STONE, sprites.stone, size);
  }

}
