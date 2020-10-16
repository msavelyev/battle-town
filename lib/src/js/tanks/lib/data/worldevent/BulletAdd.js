import { WorldEvent } from '@Lib/tanks/lib/data/worldevent/WorldEvent.js';
import { WorldEventType } from '@Lib/tanks/lib/data/worldevent/WorldEventType.js';

export function create(id, position, direction) {
  return WorldEvent(WorldEventType.BULLET_ADD, {
    id, position, direction
  });
}
