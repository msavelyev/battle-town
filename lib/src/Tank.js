import Bullet from './Bullet.js';
import Point from './Point.js';
import Entity from './Entity.js';

export default class Tank extends Entity{

  constructor(id, position, color, direction) {
    super(position);
    this.id = id;
    this.color = color;
    this.direction = direction;
  }

  newPosition(direction) {
    return this.position.move(direction, 1);
  }

  move(direction) {
    this.direction = direction;
    this.position = this.newPosition(direction);
  }

  shoot() {
    return new Bullet(this.id, this.direction, this.position);
  }

  static create(data) {
    return new Tank(
      data.id,
      Point.create(data.position),
      data.color,
      data.direction
    );
  }

}
