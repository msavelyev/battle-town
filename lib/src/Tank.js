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

  newPosition(direction) {
    switch (direction) {
      case Direction.UP:
        return new Point(this.position.x, this.position.y - 1);
      case Direction.DOWN:
        return new Point(this.position.x, this.position.y + 1);
      case Direction.LEFT:
        return new Point(this.position.x - 1, this.position.y);
      case Direction.RIGHT:
        return new Point(this.position.x + 1, this.position.y);
      default:
        throw new Error('Unknown direction ' + direction);
    }
  }

  move(direction) {
    this.direction = direction;
    this.position = this.newPosition(direction);
  }

  collides(position) {
    return this.position.eq(position);
  }

  static create(data) {
    return new Tank(
      data.id,
      Point.create(data.position),
      data.color,
      data.direction
    );
  }

  static get SIZE() {
    return World.BLOCK_SIZE;
  }

}
