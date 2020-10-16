const uuid = require('uuid').v4;
const {copy} = require('@Lib/tanks/lib/util/immutable.js');
const Direction = require('@Lib/tanks/lib/data/primitives/Direction.js');
const {DirectionType} = require('@Lib/tanks/lib/data/primitives/DirectionType.js');
const Entity = require('@Lib/tanks/lib/data/entity/Entity.js');
const {EntityType} = require('@Lib/tanks/lib/data/entity/EntityType.js');
const {FPS} = require('@Lib/tanks/lib/Ticker.js');
const Point = require('@Lib/tanks/lib/data/primitives/Point.js');
const Bullet = require('@Lib/tanks/lib/data/entity/Bullet.js');

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
function create(id, position, tick) {
  const entity = Entity.create(id, EntityType.EXPLOSION, position, 4);
  return copy(entity, {
    tick
  });
}
module.exports.create = create;

/**
 *
 * @param {Bullet} bullet
 * @param {number} tick
 * @returns {Explosion}
 */
function fromBullet(bullet, tick) {
  return create(
    uuid(),
    calcPosition(bullet),
    tick
  );
}
module.exports.fromBullet = fromBullet;

const LIFETIME_TICKS = FPS;
module.exports.LIFETIME_TICKS = LIFETIME_TICKS;
