import { EntityState } from '../../../../../lib/src/data/entity/EntityState.js';
import Sprites from '../Sprites.js';

export default class BlockRenderer {

  constructor(ctx, world, type, image, size) {
    this.ctx = ctx;
    this.world = world;
    this.type = type;
    this.image = image;
    this.size = size;
  }

  update(event) {
    for (let block of this.world.blocks) {
      if (block.state === EntityState.DEAD) {
        continue;
      }

      if (block.type === this.type) {
        this.drawBlock(this.ctx, block, event);
      }
    }
  }

  drawBlock(ctx, block, event) {
    const size = block.size * this.size.unit;
    ctx.setTransform(1, 0, 0, 1, block.position.x * this.size.unit, block.position.y * this.size.unit);
    if (block.state === EntityState.REVIVING) {
      ctx.globalAlpha = 0.5;
    }

    let draw = true;
    if (block.state === EntityState.REVIVING) {
      if (Math.ceil(event.tick / 15) % 2 !== 0) {
        draw = false;
      }
    }

    if (draw) {
      Sprites.draw(ctx, this.image, 0, 0, size, size);
    }
    ctx.globalAlpha = 1;
    ctx.resetTransform();
  }

}
