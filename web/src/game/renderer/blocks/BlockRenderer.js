import Entity from '../../../../../lib/src/Entity.js';

export default class BlockRenderer {

  constructor(ctx, world, type, image) {
    this.ctx = ctx;
    this.world = world;
    this.type = type;
    this.image = image;
  }

  update(event) {
    for (let block of this.world.blocks) {
      if (block.type === this.type) {
        this.drawBlock(this.ctx, block, event);
      }
    }
  }

  drawBlock(ctx, block, event) {
    const size = block.size * Entity.BLOCK_SIZE;
    ctx.setTransform(1, 0, 0, 1, block.position.x * size, block.position.y * size);
    ctx.drawImage(this.image, 0, 0, size, size, 0, 0, size, size);
    ctx.resetTransform();
  }

}
