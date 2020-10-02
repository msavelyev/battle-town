import { WorldEvent } from './WorldEvent.js';
import { WorldEventType } from './WorldEventType.js';

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
  match.state = state.state;
  match.stateSinceTick = state.stateSinceTick;
  match.nextStateOnTick = state.nextStateOnTick;
  match.stateSpotlight = state.stateSpotlight;
}
