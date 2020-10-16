import { WorldEvent } from './WorldEvent.js';
import { WorldEventType } from './WorldEventType.js';

export function create(id) {
  return WorldEvent(WorldEventType.BLOCK_REMOVE, { id });
}
