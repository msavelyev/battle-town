import copy from '../../util/copy.js';
import * as Point from '../primitives/Point.js';
import * as World from '../World.js';
import * as Entity from './Entity.js';
import {EntityType} from './EntityType.js';

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

  let newPosition = Point.move(tank.position, tank.direction, tank.speed);

  if (changingDirection) {
    newPosition = Point.round(newPosition);
  }

  const newTank = copy(tank, {
    direction,
    position: newPosition
  });

  if (World.collides(world, newTank).length > 0) {
    if (changingDirection) {
      return copy(tank, {
        direction
      });
    }
    return null;
  }

  return newTank;
}
