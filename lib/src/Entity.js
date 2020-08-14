import Point from './Point.js';

export default class Entity {

  constructor(position) {
    this.position = position;
  }

  static get BLOCK_SIZE() {
    return 32;
  }

  getSize() {
    return Entity.BLOCK_SIZE;
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
      this.position.x + 1,
      this.position.y + 1
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
      console.log(
        entity,
        'collides with',
        entity,
        {
          tl: this.getTopLeft(),
          br: this.getBottomRight()
        },
        {
          tl: entity.getTopLeft(),
          br: entity.getBottomRight()
        }
      );
      return true;
    }
  }

}
