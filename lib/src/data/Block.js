import BlockType from './BlockType.js';
import Entity from './Entity.js';
import EntityState from './EntityState.js';
import EntityType from './EntityType.js';

export default class Block extends Entity {

  constructor(id, position, type, size) {
    super(id, EntityType.BLOCK, position, size);
    this.type = Math.floor(type);
    this.subtype = type;
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

  static revive(block, tick) {
    block.state = EntityState.REVIVING;
    block.revivingSince = tick;
  }

  static makeAlive(block) {
    block.state = EntityState.ALIVE;
    block.revivingSince = null;
  }

}
