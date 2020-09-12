import Direction from './Direction.js';

export default class Point {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static round(point) {
    return new Point(Math.round(point.x), Math.round(point.y));
  }

  static move(point, direction, by) {
    return new Point(point.x + by * Direction.dx(direction), point.y + by * Direction.dy(direction));
  }

}
