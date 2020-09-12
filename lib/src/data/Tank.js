import Point from './Point.js';
import Entity from './Entity.js';
import EntityType from './EntityType.js';
import World from './World.js';

import { Tank } from '../protobuf/Data.js';

Tank.SPEED = 0.1;

Tank.n = function(id, name, position, direction) {
  const entity = Entity.n(id, EntityType.TANK, position, 2);
  return Tank.create({ entity, name, direction });
};

Tank.move = function(tank, world, direction) {
  const changingDirection = tank.direction !== direction;
  tank.direction = direction;

  const oldPosition = tank.entity.position;
  tank.entity.position = Point.move(tank.entity.position, tank.direction, Tank.SPEED);

  if (changingDirection) {
    tank.entity.position = Point.round(tank.entity.position);
  }

  if (World.collides(world, tank).length > 0) {
    tank.entity.position = oldPosition;
    return false;
  }

  return true;
}

export default Tank;
