import Direction from './Direction.js';

export default class Point {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  eq(point) {
    return this.x === point.x && this.y === point.y;
  }

  move(direction, by) {
    switch (direction) {
      case Direction.UP:
        return new Point(this.x, this.y - by);
      case Direction.DOWN:
        return new Point(this.x, this.y + by);
      case Direction.LEFT:
        return new Point(this.x - by, this.y);
      case Direction.RIGHT:
        return new Point(this.x + by, this.y);
      default:
        throw new Error('Unknown direction ' + direction);
    }
  }

  static create(data) {
    return new Point(data.x, data.y);
  }

}
