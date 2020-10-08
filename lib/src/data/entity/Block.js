import {copy} from '../../util/immutable.js';
import {BlockType} from './BlockType.js';
import * as Entity from './Entity.js';
import {EntityType} from './EntityType.js';

/**
 *
 * @typedef BlockOnly
 * @property {number} type
 * @property {BlockType} subType
 *
 * @typedef {Entity & BlockOnly} Block
 */


/**
 *
 * @param {number} id
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
