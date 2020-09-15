import WorldEvent from './WorldEvent.js';
import WorldEventType from './WorldEventType.js';

export default class State extends WorldEvent {

  constructor(state, stateSinceTick, nextStateOnTick, stateSpotlight) {
    super(WorldEventType.STATE);
    this.state = state;
    this.stateSinceTick = stateSinceTick;
    this.nextStateOnTick = nextStateOnTick;
    this.stateSpotlight = stateSpotlight;
  }

  static fromMatch(match) {
    return new State(
      match.state,
      match.stateSinceTick,
      match.nextStateOnTick,
      match.stateSpotlight
    );
  }

  static toMatch(state, match) {
    match.state = state.state;
    match.stateSinceTick = state.stateSinceTick;
    match.nextStateOnTick = state.nextStateOnTick;
    match.stateSpotlight = state.stateSpotlight;
  }

}
