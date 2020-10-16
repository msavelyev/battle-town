const {FPS} = require('@Lib/tanks/lib/Ticker.js');
const {copy} = require('@Lib/tanks/lib/util/immutable.js');
const EntityState = require('@Lib/tanks/lib/data/entity/EntityState.js');

const DEAD_TICKS = 5 * FPS;
module.exports.DEAD_TICKS = DEAD_TICKS;
const REVIVING_TICKS = 2 * FPS;
module.exports.REVIVING_TICKS = REVIVING_TICKS;

/**
 * @typedef {Object} Entity
 * @property {string} id
 * @property {EntityType} entityType
 * @property {Point} position
 * @property {number} size
 * @property {number} width
 * @property {number} height
 * @property {EntityState} state
 * @property {number} stateSince
 */

/**
 *
 * @param {string} id
 * @param {EntityType} entityType
 * @param {Point} position
 * @param {number} size
 * @return {Entity}
 */
function create(id, entityType, position, size) {
  return {
    id: id,
    entityType: entityType,
    position: position,
    size: size,
    width: size,
    height: size,
    state: EntityState.ALIVE,
    stateSince: null,
  };
}
module.exports.create = create;

/**
 * @selector
 *
 * @param {Entity} entity
 * @param {Entity} other
 * @returns boolean
 */
function collides(entity, other) {
  if (entity.state === EntityState.DEAD) {
    return false;
  }

  if (entity.state === EntityState.REVIVING) {
    return false;
  }

  if (entity.position.y >= (other.position.y + other.height)) {
    return false;
  } else if ((entity.position.y + entity.height) <= other.position.y) {
    return false;
  } else if (entity.position.x >= (other.position.x + other.width)) {
    return false;
  } else {
    return (entity.position.x + entity.width) > other.position.x;
  }
}
module.exports.collides = collides;

/**
 * @modifying
 *
 * @param {Entity} entity
 * @param {number} tick
 * @returns {Entity}
 */
function kill(entity, tick) {
  return copy(entity, {
    state: EntityState.DEAD,
    stateSince: tick,
  });
}
module.exports.kill = kill;

/**
 * @modifying
 *
 * @param {Entity} entity
 * @param {number} tick
 * @returns {Entity}
 */
function revive(entity, tick) {
  return copy(entity, {
    state: EntityState.REVIVING,
    stateSince: tick,
  });
}
module.exports.revive = revive;

/**
 * @modifying
 *
 * @param {Entity} entity
 * @param {number} tick
 * @returns {Entity}
 */
function makeAlive(entity, tick) {
  return copy(entity, {
    state: EntityState.ALIVE,
    stateSince: tick,
  });
}
module.exports.makeAlive = makeAlive;
