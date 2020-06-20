import Point from './Point.js';

export default class Bullet {

  constructor(id, direction, position) {
    this.id = id;
    this.direction = direction;
    this.position = position;
  }

  update(event) {
    const delta = event.delta;
    this.position = this.position.move(this.direction, delta * 0.025);
  }

  static create(data) {
    return new Bullet(data.id, data.direction, Point.create(data.position));
  }

}
