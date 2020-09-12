
import { Entity } from '../protobuf/Data.js';

Entity.n = function(id, entityType, position, size) {
  return Entity.create({ id, entityType, position, size });
};

Entity.collides = function(entity, other) {
  entity = entity.entity;
  other = other.entity;

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
};

Entity.BLOCK_SIZE = 16;

export default Entity;
