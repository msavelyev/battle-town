import {copy} from '@Lib/tanks/lib/util/immutable.js';
import { WorldEvent } from '@Lib/tanks/lib/data/worldevent/WorldEvent.js';
import { WorldEventType } from '@Lib/tanks/lib/data/worldevent/WorldEventType.js';

function create(state, stateSinceTick, nextStateOnTick, stateSpotlight) {
  return WorldEvent(WorldEventType.STATE, {
    state, stateSinceTick, nextStateOnTick, stateSpotlight
  });
}

export function fromMatch(match) {
  return create(
    match.state,
    match.stateSinceTick,
    match.nextStateOnTick,
    match.stateSpotlight
  );
}

export function toMatch(state, match) {
  return copy(match, state);
}
