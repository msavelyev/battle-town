import {FRAME_TIME} from './Ticker.js';

export default class Point {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  eq(point) {
    if (!point) {
      return false;
    }
    return this.x === point.x && this.y === point.y;
  }

  move(direction, by) {
    return new Point(this.x + by * direction.dx, this.y + by * direction.dy);
  }

  within(other, speed) {
    const threshold = speed * FRAME_TIME * 2;
    return Math.abs(this.x - other.x) < threshold
      && Math.abs(this.y - other.y) < threshold;
  }

  round() {
    return new Point(Math.round(this.x), Math.round(this.y));
  }

  static create(data) {
    return new Point(data.x, data.y);
  }

}
