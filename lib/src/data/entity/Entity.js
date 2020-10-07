import {FPS} from '../../Ticker.js';
import copy from '../../util/copy.js';
import { EntityState } from './EntityState.js';

export const DEAD_TICKS = 5 * FPS;
export const REVIVING_TICKS = 2 * FPS;

export function create(id, entityType, position, size) {
  return {
    id: id,
    entityType: entityType,
    position: position,
    size: size,
    width: size,
    height: size,
    state: EntityState.ALIVE,
    stateSince: null,
  }
}

export function collides(entity, other) {
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
  } else {
    return (entity.position.x + entity.width) > other.position.x;
  }
}

export function kill(entity, tick) {
  entity.state = EntityState.DEAD;
  entity.stateSince = tick;
}

export function revive(entity, tick) {
  return Object.assign(copy(entity), {
    state: EntityState.REVIVING,
    stateSince: tick
  })
}

export function makeAlive(entity) {
  entity.state = EntityState.ALIVE;
  entity.stateSince = null;
}
