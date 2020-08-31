import Point from './Point.js';

export default class Entity {

  constructor(position) {
    this.position = position;
  }

  static get BLOCK_SIZE() {
    return 16;
  }

  getSize() {
    return 1;
  }

  getPosition() {
    return this.position;
  }

  getTopLeft() {
    return new Point(
      this.position.x,
      this.position.y
    );
  }

  getBottomRight() {
    return new Point(
      this.position.x + this.getSize(),
      this.position.y + this.getSize()
    );
  }

  collides(entity) {
    if (this.getTopLeft().y >= entity.getBottomRight().y) {
      return false;
    } else if (this.getBottomRight().y <= entity.getTopLeft().y) {
      return false;
    } else if (this.getTopLeft().x >= entity.getBottomRight().x) {
      return false;
    } else if (this.getBottomRight().x <= entity.getTopLeft().x) {
      return false;
    } else {
      return true;
    }
  }

}
