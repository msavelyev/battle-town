import Point from './Point.js';
import Entity from './Entity.js';

export default class Bullet extends Entity {

  constructor(id, direction, position) {
    super(position);
    this.id = id;
    this.direction = direction;
  }

  getSize() {
    return 2;
  }

  update(event) {
    const delta = event.delta;
    this.position = this.position.move(this.direction, delta * 0.025);
  }

  static create(data) {
    return new Bullet(data.id, data.direction, Point.create(data.position));
  }

}
