import BlockType from './BlockType.js';
import Entity from './Entity.js';
import EntityType from './EntityType.js';

export default class Block extends Entity {

  constructor(id, position, type) {
    super(id, EntityType.BLOCK, position, 1);
    this.type = type;
  }

  static collides(block, other) {
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

}
