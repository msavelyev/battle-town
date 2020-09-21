import {FPS} from '../Ticker.js';
import EntityState from './EntityState.js';

export const DEAD_TICKS = 5 * FPS;
export const REVIVING_TICKS = 2 * FPS;

export default class Entity {

  constructor(id, entityType, position, size) {
    this.id = id;
    this.entityType = entityType;
    this.position = position;
    this.size = size;
    this.width = size;
    this.height = size;
    this.state = EntityState.ALIVE;
    this.stateSince = null;
  }

  static collides(entity, other) {
    if (entity.state === EntityState.DEAD) {
      return false;
    }

    if (entity.state === EntityState.REVIVING) {
      return false;
    }

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

  static kill(entity, tick) {
    entity.state = EntityState.DEAD;
    entity.stateSince = tick;
  }

  static revive(entity, tick) {
    entity.state = EntityState.REVIVING;
    entity.stateSince = tick;
  }

  static makeAlive(entity) {
    entity.state = EntityState.ALIVE;
    entity.stateSince = null;
  }

}
