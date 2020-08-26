import BlockType from './BlockType.js';
import Point from './Point.js';
import Entity from './Entity.js';
import Bullet from './Bullet.js';

export default class Block extends Entity {

  constructor(position, type) {
    super(position);
    this.id = 'block';
    this.type = type;
  }

  collides(entity) {
    if (this.type === BlockType.JUNGLE || this.type === BlockType.EMPTY) {
      return false;
    }

    if (this.type === BlockType.WATER && entity instanceof Bullet) {
      return false;
    }

    const collides = super.collides(entity);

    if (collides && this.type === BlockType.BRICK && entity instanceof Bullet) {
      this.destroy();
    }

    return collides;
  }

  destroy() {
    this.type = BlockType.EMPTY;
  }

  static create(data) {
    return new Block(
      Point.create(data.position),
      data.type
    );
  }

}
