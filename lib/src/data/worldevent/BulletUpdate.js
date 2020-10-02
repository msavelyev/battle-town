import { WorldEvent } from './WorldEvent.js';
import { WorldEventType } from './WorldEventType.js';

export function create(id, position) {
  return WorldEvent(WorldEventType.BULLET_UPDATE, {
    id, position
  });
}
