import Point from './Point.js';
import Entity from './Entity.js';
import EntityType from './EntityType.js';

export default class Bullet extends Entity {

  constructor(id, direction, position) {
    super(id, EntityType.BULLET, position, 2);
    this.direction = direction;
  }

  static update(bullet, event) {
    const delta = event.delta;
    bullet.position = Point.move(bullet.position, bullet.direction, delta * 0.025);
  }

}
