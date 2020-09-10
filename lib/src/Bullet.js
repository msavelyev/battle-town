import Point from './Point.js';
import Entity from './Entity.js';
import EntityType from './EntityType.js';

export default class Bullet extends Entity {

  constructor(id, direction, position) {
    super(id, EntityType.BULLET, position, Bullet.size());
    this.direction = direction;
  }

  static size() {
    return 1;
  }

  static create(id, direction, tank) {
    return new Bullet(
      id,
      direction,
      new Point(tank.position.x + Bullet.size() / 2, tank.position.y + Bullet.size() / 2)
    );
  }

  static update(bullet, event) {
    const delta = event.delta;
    bullet.position = Point.move(bullet.position, bullet.direction, delta * 0.025);
  }

}
