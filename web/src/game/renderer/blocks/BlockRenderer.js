import { EntityState } from '../../../../../lib/src/data/entity/EntityState.js';
import Sprites from '../Sprites.js';

export default class BlockRenderer {

  constructor(ctx, game, type, image) {
    this.ctx = ctx;
    this.game = game;
    this.type = type;
    this.image = image;
  }

  update(event) {
    for (let block of this.game.match.world.blocks) {
      if (block.state === EntityState.DEAD) {
        continue;
      }

      if (block.type === this.type) {
        this.drawBlock(this.ctx, block, event);
      }
    }
  }

  drawBlock(ctx, block, event) {
    const gameSize = this.game.size;
    const size = block.size * gameSize.unit;
    ctx.setTransform(1, 0, 0, 1, block.position.x * gameSize.unit, block.position.y * gameSize.unit);
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
