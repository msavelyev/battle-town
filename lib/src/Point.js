
export default class Point {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  eq(point) {
    return this.x === point.x && this.y === point.y;
  }

  static create(data) {
    return new Point(data.x, data.y);
  }

}
