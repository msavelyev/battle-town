import BlockType from '../../../../../lib/src/BlockType.js';
import BlockRenderer from './BlockRenderer.js';
import sprites from '../Sprites.js';

export default class WaterRenderer extends BlockRenderer {

  constructor(ctx, world) {
    super(ctx, world, BlockType.WATER, sprites.water1);
  }

  drawBlock(ctx, block, event) {
    if (Math.ceil(event.time / 400) % 2 === 0) {
      this.image = sprites.water1;
    } else {
      this.image = sprites.water2;
    }

    super.drawBlock(ctx, block, event);
  }

}
