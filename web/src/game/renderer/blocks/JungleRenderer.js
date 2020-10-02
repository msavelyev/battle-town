import { BlockType } from '../../../../../lib/src/data/BlockType.js';
import BlockRenderer from './BlockRenderer.js';

export default class JungleRenderer extends BlockRenderer {

  constructor(ctx, world, sprites, size) {
    super(ctx, world, BlockType.JUNGLE, sprites.jungle, size);
  }

}
