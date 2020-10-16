const {WorldEvent} = require('@Lib/tanks/lib/data/worldevent/WorldEvent.js');
const {WorldEventType} = require('@Lib/tanks/lib/data/worldevent/WorldEventType.js');

function create(score) {
  return WorldEvent(WorldEventType.SCORE, { score });
}
module.exports.create = create;
