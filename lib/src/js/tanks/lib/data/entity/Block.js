import {copy} from 'Lib/tanks/lib/util/immutable.js';
import BlockType from 'Lib/tanks/lib/data/entity/BlockType.js';
import * as Entity from 'Lib/tanks/lib/data/entity/Entity.js';
import {EntityType} from 'Lib/tanks/lib/data/entity/EntityType.js';

/**
 *
 * @typedef BlockOnly
 * @property {number} type
 * @property {BlockType} subType
 * @property {number} visibleBy
 *
 * @typedef {Entity & BlockOnly} Block
 */


/**
 *
 * @param {string} id
 * @param {Point} position
 * @param {BlockType} type
 * @param {number} size
 * @return {Block}
 */
export function create(id, position, type, size) {
  const entity = Entity.create(id, EntityType.BLOCK, position, size);
  return copy(entity, {
    type: Math.floor(type),
    subtype: type,
    visibleBy: 0,
  });
}

/**
 *
 * @param {Block} block
 * @param {Entity} other
 * @return {boolean}
 */
export function collides(block, other) {
  if (block.type === BlockType.SPAWN) {
    return false;
  }

  if (block.type === BlockType.JUNGLE || block.type === BlockType.EMPTY) {
    return false;
  }

  if (block.type === BlockType.WATER && other.entityType === EntityType.BULLET) {
    return false;
  }

  return Entity.collides(block, other);
}
