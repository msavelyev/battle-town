import { WorldEvent } from './WorldEvent.js';
import { WorldEventType } from './WorldEventType.js';

export function create(tanks) {
  return WorldEvent(WorldEventType.RESET_TANKS, { tanks });
}
