import { WorldEvent } from './WorldEvent.js';
import { WorldEventType } from './WorldEventType.js';

export function create(blocks) {
  return WorldEvent(WorldEventType.RESET_LEVEL, { blocks });
}
