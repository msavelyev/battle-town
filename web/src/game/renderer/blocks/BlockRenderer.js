import Entity from '../../../../../lib/src/Entity.js';
import BlockType from '../../../../../lib/src/BlockType.js';
import sprites from '../Sprites.js';

export default class BlockRenderer {

  constructor(ctx, world, type, color) {
    this.ctx = ctx;
    this.world = world;
    this.type = type;
    this.color = color;
  }

  update(event) {
    this.world.blocks.forEach(block => {
      if (block.type === this.type) {
        this.drawBlock(this.ctx, block, event);
      }
    });
  }

  drawBlock(ctx, block, event) {
    const position = block.getPosition();
    const size = block.getSize() * Entity.BLOCK_SIZE;
    const x = position.x;
    const y = position.y;

    ctx.setTransform(1, 0, 0, 1, x * size, y * size);

    ctx.fillStyle = this.color;
    if (block.type === BlockType.BRICK) {
      ctx.drawImage(sprites.brick, 0, 0, 16, 16, 0, 0, size, size);
    } else if (block.type === BlockType.STONE) {
      ctx.drawImage(sprites.stone, 0, 0, 16, 16, 0, 0, size, size);
    } else if (block.type === BlockType.WATER) {
      if (Math.ceil(event.time / 400) % 2 === 0) {
        ctx.drawImage(sprites.water1, 0, 0, 16, 16, 0, 0, size, size);
      } else {
        ctx.drawImage(sprites.water2, 0, 0, 16, 16, 0, 0, size, size);
      }
    } else if (block.type === BlockType.JUNGLE) {
      ctx.drawImage(sprites.jungle, 0, 0, 16, 16, 0, 0, size, size);
    } else {
      ctx.fillRect(0, 0, size, size);
      ctx.strokeStyle = 'white';
      ctx.strokeRect(0, 0, size, size);
    }

    ctx.resetTransform();
  }

}
