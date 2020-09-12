export default class Entity {

  constructor(id, entityType, position, size) {
    this.id = id;
    this.entityType = entityType;
    this.position = position;
    this.size = size;
  }

  static get BLOCK_SIZE() {
    return 16;
  }

  static collides(entity, other) {
    if (entity.position.y >= (other.position.y + other.size)) {
      return false;
    } else if ((entity.position.y + entity.size) <= other.position.y) {
      return false;
    } else if (entity.position.x >= (other.position.x + other.size)) {
      return false;
    } else if ((entity.position.x + entity.size) <= other.position.x) {
      return false;
    } else {
      return true;
    }
  }

}
