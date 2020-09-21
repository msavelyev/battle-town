import EntityState from './EntityState.js';

export default class Entity {

  constructor(id, entityType, position, size) {
    this.id = id;
    this.entityType = entityType;
    this.position = position;
    this.size = size;
    this.width = size;
    this.height = size;
    this.state = EntityState.ALIVE;
  }

  static collides(entity, other) {
    if (entity.position.y >= (other.position.y + other.height)) {
      return false;
    } else if ((entity.position.y + entity.height) <= other.position.y) {
      return false;
    } else if (entity.position.x >= (other.position.x + other.width)) {
      return false;
    } else if ((entity.position.x + entity.width) <= other.position.x) {
      return false;
    } else {
      return true;
    }
  }

}
