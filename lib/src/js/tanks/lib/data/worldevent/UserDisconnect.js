import {WorldEvent} from 'Lib/tanks/lib/data/worldevent/WorldEvent.js';
import {WorldEventType} from 'Lib/tanks/lib/data/worldevent/WorldEventType.js';

export function create(id) {
  return WorldEvent(WorldEventType.USER_DISCONNECT, { id });
}
