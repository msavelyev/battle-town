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

    return this.position.x <= position.x
      && (this.position.x + 1) > position.x
      && this.position.y <= position.y
      && (this.position.y + 1) > position.y;
  }

  static create(data) {
    return new Block(
      Point.create(data.position),
      data.type
    );
  }

}
