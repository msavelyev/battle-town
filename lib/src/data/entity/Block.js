import copy from '../../util/copy.js';
import { BlockType } from './BlockType.js';
import * as Entity from './Entity.js';
import { EntityType } from './EntityType.js';

export function create(id, position, type, size) {
  const entity = Entity.create(id, EntityType.BLOCK, position, size);
  return copy(entity, {
    type: Math.floor(type),
    subtype: type,
  });
}

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
