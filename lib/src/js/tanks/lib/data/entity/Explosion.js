import {v4 as uuid} from 'uuid';
import {copy} from 'Lib/tanks/lib/util/immutable.js';
import * as Direction from 'Lib/tanks/lib/data/primitives/Direction.js';
import {DirectionType} from 'Lib/tanks/lib/data/primitives/DirectionType.js';
import * as Entity from 'Lib/tanks/lib/data/entity/Entity.js';
import {EntityType} from 'Lib/tanks/lib/data/entity/EntityType.js';
import {FPS} from 'Lib/tanks/lib/Ticker.js';
import Point from 'Lib/tanks/lib/data/primitives/Point.js';
import * as Bullet from 'Lib/tanks/lib/data/entity/Bullet.js';

/**
 * @typedef {Entity} ExplosionOnly
 * @property {number} tick
 *
 * @typedef {Entity & ExplosionOnly} Explosion
 */

/**
 *
 * @param {Bullet} bullet
 * @returns {Point}
 */
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

/**
 *
 * @param {string} id
 * @param {Point} position
 * @param {number} tick
 * @returns {Explosion}
 */
export function create(id, position, tick) {
  const entity = Entity.create(id, EntityType.EXPLOSION, position, 4);
  return copy(entity, {
    tick
  });
}

/**
 *
 * @param {Bullet} bullet
 * @param {number} tick
 * @returns {Explosion}
 */
export function fromBullet(bullet, tick) {
  return create(
    uuid(),
    calcPosition(bullet),
    tick
  );
}

export const LIFETIME_TICKS = FPS;
