import BlockType from './BlockType.js';
import Entity from './Entity.js';
import EntityType from './EntityType.js';

import { Block } from '../protobuf/Data.js';

Block.n = function(position, type) {
  const entity = Entity.n(null, EntityType.BLOCK, position, 1);
  return Block.create({ entity, type });
};

Block.collides = function(block, other) {
  if (block.type === BlockType.SPAWN) {
    return false;
  }

  if (block.type === BlockType.JUNGLE || block.type === BlockType.EMPTY) {
    return false;
  }

  if (block.type === BlockType.WATER && other.entity.entityType === EntityType.BULLET) {
    return false;
  }

  const collides = Entity.collides(block, other);

  if (collides && block.type === BlockType.BRICK && other.entity.entityType === EntityType.BULLET) {
    block.type = BlockType.EMPTY;
  }

  return collides;
};

export default Block;
