import Point from './Point.js';
import Entity from './Entity.js';
import EntityType from './EntityType.js';

export default class Tank extends Entity {

  constructor(id, position, color, direction) {
    super(id, EntityType.TANK, position, 2);
    this.color = color;
    this.direction = direction;
    this.speed = 0.2;
  }

  static move(tank, world, direction) {
    const changingDirection = tank.direction !== direction;
    tank.direction = direction;

    const oldPosition = tank.position;
    tank.position = Point.move(tank.position, tank.direction, tank.speed);

    if (changingDirection) {
      tank.position = Point.round(tank.position);
    }

    if (world.collides(tank)) {
      tank.position = oldPosition;
      return false;
    }

    return true;
  }

}
