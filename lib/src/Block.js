import BlockType from './BlockType.js';
import Point from './Point.js';
import Entity from './Entity.js';

export default class Block extends Entity {

  constructor(position, type) {
    super(position);
    this.id = 'block';
    this.type = type;
  }

  collides(entity) {
    if (this.type === BlockType.JUNGLE) {
      return false;
    }

    return super.collides(entity);
  }

  static create(data) {
    return new Block(
      Point.create(data.position),
      data.type
    );
  }

}
