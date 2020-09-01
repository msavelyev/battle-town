export default class Entity {

  constructor(id, position, size) {
    this.id = id;
    this.position = position;
    this.size = size;
  }

  static get BLOCK_SIZE() {
    return 16;
  }

  collides(entity) {
    if (this.position.y >= (entity.position.y + entity.size)) {
      return false;
    } else if ((this.position.y + this.size) <= entity.position.y) {
      return false;
    } else if (this.position.x >= (entity.position.x + entity.size)) {
      return false;
    } else if ((this.position.x + this.size) <= entity.position.x) {
      return false;
    } else {
      return true;
    }
  }

}
