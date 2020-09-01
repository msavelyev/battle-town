import Point from './Point.js';
import Entity from './Entity.js';
import Direction from './Direction.js';

export default class Bullet extends Entity {

  constructor(id, direction, position) {
    super(id, position, 2);
    this.direction = direction;
  }

  update(event) {
    const delta = event.delta;
    this.position = this.position.move(this.direction, delta * 0.025);
  }

  static create(data) {
    return new Bullet(data.id, Direction.create(data.direction), Point.create(data.position));
  }

}
