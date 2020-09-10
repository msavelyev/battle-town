import Entity from '../../../../lib/src/Entity.js';

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

      const size = explosion.size * Entity.BLOCK_SIZE;
      const x = explosion.position.x;
      const y = explosion.position.y;
      this.ctx.setTransform(1, 0, 0, 1, x * Entity.BLOCK_SIZE, y * Entity.BLOCK_SIZE);
      this.ctx.drawImage(image, 0, 0, size, size, 0, 0, size, size);
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
