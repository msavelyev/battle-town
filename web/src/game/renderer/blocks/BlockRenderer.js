import World from '../../../../../lib/src/World.js';
import Entity from '../../../../../lib/src/Entity.js';

export default class BlockRenderer {

  constructor(ctx, world, type, color) {
    this.ctx = ctx;
    this.world = world;
    this.type = type;
    this.color = color;
  }

  update() {
    this.world.blocks.forEach(block => {
      if (block.type === this.type) {
        this.drawBlock(this.ctx, block);
      }
    });
  }

  drawBlock(ctx, block) {
    const position = block.getPosition();
    const size = block.getSize() * Entity.BLOCK_SIZE;
    const x = position.x;
    const y = position.y;

    ctx.setTransform(1, 0, 0, 1, x * size, y * size);

    ctx.fillStyle = this.color;
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(0, 0, size, size);

    ctx.resetTransform();
  }

}
