import BlockType from '../../../../../lib/src/data/BlockType.js';
import BlockRenderer from './BlockRenderer.js';

export default class WaterRenderer extends BlockRenderer {

  constructor(ctx, world, sprites) {
    super(ctx, world, BlockType.WATER, sprites.water1);
    this.sprites = sprites;
  }

  drawBlock(ctx, block, event) {
    if (Math.ceil(event.time / 400) % 2 === 0) {
      this.image = this.sprites.water1;
    } else {
      this.image = this.sprites.water2;
    }

    super.drawBlock(ctx, block, event);
  }

}
