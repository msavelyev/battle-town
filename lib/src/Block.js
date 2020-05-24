import BlockType from './BlockType.js';
import Point from './Point.js';

export default class Block {

  constructor(position, type) {
    this.position = position;
    this.type = type;
  }

  collides(position) {
    if (this.type === BlockType.JUNGLE) {
      return false;
    }

    return this.position.eq(position);
  }

  static create(data) {
    return new Block(
      Point.create(data.position),
      data.type
    );
  }

}
