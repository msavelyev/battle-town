import Bullet from './Bullet.js';
import Point from './Point.js';
import Entity from './Entity.js';

export default class Tank extends Entity {

  constructor(id, position, color, direction, moving) {
    super(position);
    this.id = id;
    this.color = color;
    this.direction = direction;
    this.moving = moving;
  }

  getSize() {
    return 2;
  }

  newPosition(direction) {
    return this.position.move(direction, 1);
  }

  move(direction) {
    this.direction = direction;
    this.position = this.newPosition(direction);
  }

  stop(position) {
    if (position) {
      this.position = position;
    }
    this.moving = false;
  }

  shoot(position) {
    return new Bullet(this.id, this.direction, position);
  }

  update(event) {
    if (!this.moving) {
      return;
    }

    const delta = event.delta;
    const oldPosition = this.position;
    this.position = this.position.move(this.direction, delta * 0.01);
    return oldPosition;
  }

  static create(data) {
    return new Tank(
      data.id,
      Point.create(data.position),
      data.color,
      data.direction,
      data.moving
    );
  }

}
