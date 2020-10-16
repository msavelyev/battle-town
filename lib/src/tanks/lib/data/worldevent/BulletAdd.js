import { WorldEvent } from './WorldEvent.js';
import { WorldEventType } from './WorldEventType.js';

export function create(id, position, direction) {
  return WorldEvent(WorldEventType.BULLET_ADD, {
    id, position, direction
  });
}
