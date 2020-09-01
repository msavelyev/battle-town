import Bullet from './Bullet.js';
import Point from './Point.js';
import Entity from './Entity.js';
import Direction from './Direction.js';

export default class Tank extends Entity {

  constructor(id, position, color, direction, moving) {
    super(id, position, 2);
    this.color = color;
    this.direction = direction;
    this.moving = moving;
  }

  start(direction, position) {
    const changingDirection = !this.direction.eq(direction);
    this.direction = direction;
    this.moving = true;

    if (position) {
      this.position = position;
    } else {
      if (changingDirection) {
        this.position = new Point(Math.round(this.position.x), Math.round(this.position.y))
      }
    }
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
      Direction.create(data.direction),
      data.moving
    );
  }

}
