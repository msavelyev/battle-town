import BlockType from '../../../../../lib/src/BlockType.js';
import BlockRenderer from './BlockRenderer.js';

export default class JungleRenderer extends BlockRenderer {

  constructor(world) {
    super(world, BlockType.JUNGLE, 'green');
  }

  drawBlock(ctx, position) {
    ctx.globalAlpha = 0.75;
    super.drawBlock(ctx, position);
    ctx.globalAlpha = 1;
  }

}
