import BlockType from '../../../../../lib/src/BlockType.js';
import BlockRenderer from './BlockRenderer.js';

export default class JungleRenderer extends BlockRenderer {

  constructor(ctx, world, sprites) {
    super(ctx, world, BlockType.JUNGLE, sprites.jungle);
  }

}
