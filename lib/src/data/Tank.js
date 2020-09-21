import EntityState from './EntityState.js';
import Point from './Point.js';
import Entity from './Entity.js';
import EntityType from './EntityType.js';
import World from './World.js';
import TankUpdate from './worldevent/TankUpdate.js';

export default class Tank extends Entity {

  constructor(id, name, position, direction) {
    super(id, EntityType.TANK, position, 2);
    this.name = name;
    this.direction = direction;
    this.speed = 0.1;
  }

  static move(tank, world, direction) {
    const changingDirection = tank.direction !== direction;
    tank.direction = direction;

    const oldPosition = tank.position;
    tank.position = Point.move(tank.position, tank.direction, tank.speed);

    if (changingDirection) {
      tank.position = Point.round(tank.position);
    }

    if (World.collides(world, tank).length > 0) {
      tank.position = oldPosition;
      return null;
    }

    return TankUpdate.fromTank(tank);
  }

  static kill(tank) {
    tank.state = EntityState.DEAD;
  }

}
