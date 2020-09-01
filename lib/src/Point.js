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
    return new Point(this.x + by * direction.dx, this.y + by * direction.dy);
  }

  static create(data) {
    return new Point(data.x, data.y);
  }

}
