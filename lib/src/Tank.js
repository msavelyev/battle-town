import Bullet from './Bullet.js';
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
    return this.position.move(direction, 1);
  }

  move(direction) {
    this.direction = direction;
    this.position = this.newPosition(direction);
  }

  collides(position) {
    return this.position.x <= position.x
      && (this.position.x + 1) > position.x
      && this.position.y <= position.y
      && (this.position.y + 1) > position.y;
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

  static get SIZE() {
    return World.BLOCK_SIZE;
  }

}
