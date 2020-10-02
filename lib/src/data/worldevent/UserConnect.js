import { WorldEvent } from './WorldEvent.js';
import { WorldEventType } from './WorldEventType.js';

export function create(id, name) {
  return WorldEvent(WorldEventType.USER_CONNECT, {
    id, name
  });
}
