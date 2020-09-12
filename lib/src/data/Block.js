import BlockType from './BlockType.js';
import Entity from './Entity.js';
import EntityType from './EntityType.js';

export default class Block extends Entity {

  constructor(position, type) {
    super('block', EntityType.BLOCK, position, 1);
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

    const collides = Entity.collides(block, other);

    if (collides && block.type === BlockType.BRICK && other.entityType === EntityType.BULLET) {
      block.type = BlockType.EMPTY;
    }

    return collides;
  }

}