import Entity from '../../../../lib/src/data/Entity.js';
import Sprites from './Sprites.js';

export default class ExplosionsRenderer {

  constructor(ctx, world, sprites) {
    this.ctx = ctx;
    this.world = world;
    this.sprites = sprites;
  }

  update(event) {
    for (let explosion of this.world.explosions) {
      const image = this.pickImage(explosion, event);

      if (!image) {
        continue;
      }

      const x = explosion.entity.position.x;
      const y = explosion.entity.position.y;
      this.ctx.setTransform(1, 0, 0, 1, x * Entity.BLOCK_SIZE, y * Entity.BLOCK_SIZE);
      Sprites.draw(this.ctx, image, 0, 0);
      this.ctx.resetTransform();
    }
  }

  pickImage(explosion, event) {
    const tick = event.tick;
    const startTick = explosion.tick;

    const frame = Math.ceil((tick - startTick) / 10);
    switch (frame) {
      case 1:
        return this.sprites.explosion1;
      case 2:
        return this.sprites.explosion2;
      case 3:
        return this.sprites.explosion3;
      default:
        return null;
    }
  }

}
