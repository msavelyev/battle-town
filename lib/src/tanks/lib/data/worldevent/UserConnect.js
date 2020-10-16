import { WorldEvent } from '@Lib/tanks/lib/data/worldevent/WorldEvent.js';
import { WorldEventType } from '@Lib/tanks/lib/data/worldevent/WorldEventType.js';

export function create(id, name) {
  return WorldEvent(WorldEventType.USER_CONNECT, {
    id, name
  });
}
