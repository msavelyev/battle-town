const {copy} = require('@Lib/tanks/lib/util/immutable.js');
const {WorldEvent} = require('@Lib/tanks/lib/data/worldevent/WorldEvent.js');
const {WorldEventType} = require('@Lib/tanks/lib/data/worldevent/WorldEventType.js');

function create(state, stateSinceTick, nextStateOnTick, stateSpotlight) {
  return WorldEvent(WorldEventType.STATE, {
    state, stateSinceTick, nextStateOnTick, stateSpotlight
  });
}

function fromMatch(match) {
  return create(
    match.state,
    match.stateSinceTick,
    match.nextStateOnTick,
    match.stateSpotlight
  );
}
module.exports.fromMatch = fromMatch;

function toMatch(state, match) {
  return copy(match, state);
}
module.exports.toMatch = toMatch;
