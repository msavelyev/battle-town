import Direction from './Direction.js';
import DirectionType from './DirectionType.js';
import Point from './Point.js';
import Entity from './Entity.js';
import EntityType from './EntityType.js';

function bulletPosition(tank, direction) {
  switch (direction) {
    case Direction.UP:
      return new Point(tank.position.x, tank.position.y - Bullet.size() / 2);
    case Direction.DOWN:
      return new Point(tank.position.x, tank.position.y + tank.size);
    case Direction.LEFT:
      return new Point(tank.position.x - Bullet.size() / 2, tank.position.y);
    case Direction.RIGHT:
      return new Point(tank.position.x + tank.size, tank.position.y);
    default:
      throw new Error('Unknown direction ' + direction);
  }
}

export default class Bullet extends Entity {

  constructor(id, direction, position) {
    super(id, EntityType.BULLET, position, Bullet.size());
    this.direction = direction;
    if (Direction.type(direction) === DirectionType.HORIZONTAL) {
      this.height *= 2;
      this.width /= 2;
    } else {
      this.height /= 2;
      this.width *= 2;
    }
  }

  static size() {
    return 1;
  }

  static create(id, direction, tank) {
    return new Bullet(
      id,
      direction,
      bulletPosition(tank, direction)
    );
  }

  static update(bullet, event) {
    const delta = event.delta;
    bullet.position = Point.move(bullet.position, bullet.direction, delta * 0.015);
  }

}
