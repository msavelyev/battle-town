import BlockType from '../../../../../lib/src/BlockType.js';
import World from '../../../../../lib/src/World.js';

export default class BlockRenderer {

  constructor(world, type, color) {
    this.world = world;
    this.type = type;
    this.color = color;
  }

  update(canvas, event) {
    this.world.blocks.forEach(block => {
      if (block.type === this.type) {
        this.drawBlock(canvas, block.position);
      }
    });
  }

  drawBlock(canvas, position) {
    const x = position.x;
    const y = position.y;

    canvas.setTransform(1, 0, 0, 1, x * World.BLOCK_SIZE, y * World.BLOCK_SIZE);

    canvas.fillStyle = this.color;
    canvas.fillRect(0, 0, World.BLOCK_SIZE, World.BLOCK_SIZE);
    canvas.strokeStyle = 'black';
    canvas.strokeRect(0, 0, World.BLOCK_SIZE, World.BLOCK_SIZE);

    canvas.resetTransform();
  }

}
