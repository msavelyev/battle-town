import {FPS} from 'Lib/tanks/lib/Ticker.js';
import {copy} from 'Lib/tanks/lib/util/immutable.js';
import EntityState from 'Lib/tanks/lib/data/entity/EntityState.js';

export const DEAD_TICKS = 5 * FPS;
export const REVIVING_TICKS = 2 * FPS;

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
export function create(id, entityType, position, size) {
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

/**
 * @selector
 *
 * @param {Entity} entity
 * @param {Entity} other
 * @returns boolean
 */
export function collides(entity, other) {
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

/**
 * @modifying
 *
 * @param {Entity} entity
 * @param {number} tick
 * @returns {Entity}
 */
export function kill(entity, tick) {
  return copy(entity, {
    state: EntityState.DEAD,
    stateSince: tick,
  });
}

/**
 * @modifying
 *
 * @param {Entity} entity
 * @param {number} tick
 * @returns {Entity}
 */
export function revive(entity, tick) {
  return copy(entity, {
    state: EntityState.REVIVING,
    stateSince: tick,
  });
}

/**
 * @modifying
 *
 * @param {Entity} entity
 * @param {number} tick
 * @returns {Entity}
 */
export function makeAlive(entity, tick) {
  return copy(entity, {
    state: EntityState.ALIVE,
    stateSince: tick,
  });
}
