import { BlockType } from '../../../../../lib/src/data/entity/BlockType.js';
import BlockRenderer from './BlockRenderer.js';

export default class WaterRenderer extends BlockRenderer {

  constructor(ctx, world, sprites, size) {
    super(ctx, world, BlockType.WATER, sprites.water1, size);
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
