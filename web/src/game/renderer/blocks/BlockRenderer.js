import World from '../../../../../lib/src/World.js';

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
        this.drawBlock(this.ctx, block.position);
      }
    });
  }

  drawBlock(ctx, position) {
    const x = position.x;
    const y = position.y;

    ctx.setTransform(1, 0, 0, 1, x * World.BLOCK_SIZE, y * World.BLOCK_SIZE);

    ctx.fillStyle = this.color;
    ctx.fillRect(0, 0, World.BLOCK_SIZE, World.BLOCK_SIZE);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(0, 0, World.BLOCK_SIZE, World.BLOCK_SIZE);

    ctx.resetTransform();
  }

}
