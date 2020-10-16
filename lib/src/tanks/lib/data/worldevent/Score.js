import { WorldEvent } from './WorldEvent.js';
import { WorldEventType } from './WorldEventType.js';

export function create(score) {
  return WorldEvent(WorldEventType.SCORE, { score });
}
