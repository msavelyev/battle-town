import * as Point from '../primitives/Point.js';
import * as Entity from './Entity.js';
import { EntityType } from './EntityType.js';
import * as World from '../World.js';
import * as TankUpdate from '../worldevent/TankUpdate.js';

export function create(id, name, position, direction) {
  const entity = Entity.create(id, EntityType.TANK, position, 2);
  const tank = Object.assign(entity, {
    name: name,
    direction: direction,
    speed: 0.1,
  });
  return Object.freeze(tank);
}

export function move(tank, world, direction) {
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
