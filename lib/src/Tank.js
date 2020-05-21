import Direction from './Direction';
import Point from './Point';

export default class Tank {

  constructor(position) {
    this.position = position;
    this.size = 32;
  }

  move(direction) {
    switch (direction) {
      case Direction.UP:
        this.position = new Point(this.position.x, this.position.y - this.size);
        break;
      case Direction.DOWN:
        this.position = new Point(this.position.x, this.position.y + this.size);
        break;
      case Direction.LEFT:
        this.position = new Point(this.position.x - this.size, this.position.y);
        break;
      case Direction.RIGHT:
        this.position = new Point(this.position.x + this.size, this.position.y);
        break;
      default:
        throw new Error('Unknown direction ' + direction);
    }
  }

}
