import Point from './Point.js';
import Entity from './Entity.js';
import Direction from './Direction.js';

export default class Tank extends Entity {

  constructor(id, position, color, direction, moving) {
    super(id, position, 2);
    this.color = color;
    this.direction = direction;
    this.moving = moving;
    this.speed = 0.01;
  }

  start(direction, position) {
    const changingDirection = !this.direction.eq(direction);

    if (this.moving && !changingDirection) {
      return false;
    }

    this.direction = direction;
    this.moving = true;

    if (position) {
      if (changingDirection) {
        position = position.round();
      }

      if (position.within(this.position, this.speed)) {
        this.position = position;
      }
    }

    if (changingDirection) {
      this.position = this.position.round();
    }

    return true;
  }

  stop(direction, position) {
    this.direction = direction;
    if (position && position.within(this.position, this.speed)) {
      this.position = position;
    }
    this.moving = false;
  }

  update(event, world) {
    if (!this.moving) {
      return;
    }

    const delta = event.delta;
    const oldPosition = this.position;
    this.position = this.position.move(this.direction, delta * this.speed);

    if (world.collides(this)) {
      this.position = oldPosition;
    }
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
