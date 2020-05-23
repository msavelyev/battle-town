import Direction from './Direction.js';
import Point from './Point.js';

export default class Tank {

  constructor(id, position, color) {
    this.id = id;
    this.position = position;
    this.color = color;
  }

  move(direction) {
    switch (direction) {
      case Direction.UP:
        this.position = new Point(this.position.x, this.position.y - Tank.SIZE);
        break;
      case Direction.DOWN:
        this.position = new Point(this.position.x, this.position.y + Tank.SIZE);
        break;
      case Direction.LEFT:
        this.position = new Point(this.position.x - Tank.SIZE, this.position.y);
        break;
      case Direction.RIGHT:
        this.position = new Point(this.position.x + Tank.SIZE, this.position.y);
        break;
      default:
        throw new Error('Unknown direction ' + direction);
    }
  }

  static create(data) {
    return new Tank(data.id, data.position, data.color);
  }

  static get SIZE() {
    return 32;
  }

}