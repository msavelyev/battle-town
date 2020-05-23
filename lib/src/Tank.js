import Direction from './Direction.js';
import Point from './Point.js';
import World from './World.js';

export default class Tank {

  constructor(id, position, color, direction) {
    this.id = id;
    this.position = position;
    this.color = color;
    this.direction = direction;
  }

  move(direction) {
    this.direction = direction;
    switch (direction) {
      case Direction.UP:
        this.position = new Point(this.position.x, this.position.y - 1);
        break;
      case Direction.DOWN:
        this.position = new Point(this.position.x, this.position.y + 1);
        break;
      case Direction.LEFT:
        this.position = new Point(this.position.x - 1, this.position.y);
        break;
      case Direction.RIGHT:
        this.position = new Point(this.position.x + 1, this.position.y);
        break;
      default:
        throw new Error('Unknown direction ' + direction);
    }
  }

  static create(data) {
    return new Tank(data.id, data.position, data.color, data.direction);
  }

  static get SIZE() {
    return World.BLOCK_SIZE;
  }

}
