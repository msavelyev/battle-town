import {v4 as uuid} from 'uuid';
import * as Direction from '../primitives/Direction.js';
import { DirectionType } from '../primitives/DirectionType.js';
import * as Entity from './Entity.js';
import { EntityType } from './EntityType.js';
import {FPS} from '../../Ticker.js';
import * as Point from '../primitives/Point.js';
import * as Bullet from './Bullet.js';

function calcPosition(bullet) {
  const directionType = Direction.type(bullet.direction);
  switch (directionType) {
    case DirectionType.HORIZONTAL:
      return Point.create(bullet.position.x + Bullet.size() / 4 - Bullet.size(), bullet.position.y);
    case DirectionType.VERTICAL:
      return Point.create(bullet.position.x, bullet.position.y + Bullet.size() / 4 - Bullet.size());
    default:
      throw new Error('Unknown direction type ' + directionType);
  }
}

export function create(id, position, tick) {
  return Object.assign(Entity.create(id, EntityType.EXPLOSION, position, 2), {
    tick
  })
}

export function fromBullet(bullet, tick) {
  return create(
    uuid(),
    calcPosition(bullet),
    tick
  );
}

export const LIFETIME_TICKS = FPS;
