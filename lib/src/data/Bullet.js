import * as Direction from './Direction.js';
import { DirectionType } from './DirectionType.js';
import * as Point from './Point.js';
import * as Entity from './Entity.js';
import { EntityType } from './EntityType.js';

function bulletPosition(tank, direction) {
  switch (direction) {
    case Direction.Direction.UP:
      return Point.create(tank.position.x, tank.position.y);
    case Direction.Direction.DOWN:
      return Point.create(tank.position.x, tank.position.y + tank.size - size() / 2);
    case Direction.Direction.LEFT:
      return Point.create(tank.position.x, tank.position.y);
    case Direction.Direction.RIGHT:
      return Point.create(tank.position.x + tank.size - size() / 2, tank.position.y);
    default:
      throw new Error('Unknown direction ' + direction);
  }
}

export function create(id, direction, position) {
  const entity = Entity.create(id, EntityType.BULLET, position, size())

  entity.direction = direction;
  if (Direction.type(direction) === DirectionType.HORIZONTAL) {
    entity.height *= 2;
    entity.width /= 2;
  } else {
    entity.height /= 2;
    entity.width *= 2;
  }

  return entity;
}

export function size() {
  return 1;
}

export function fromTank(id, direction, tank) {
  return create(
    id,
    direction,
    bulletPosition(tank, direction)
  );
}

export function update(bullet, event) {
  const delta = event.delta;
  bullet.position = Point.move(bullet.position, bullet.direction, delta * 0.015);
}
