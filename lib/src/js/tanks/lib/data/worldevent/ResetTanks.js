const {WorldEvent} = require('@Lib/tanks/lib/data/worldevent/WorldEvent.js');
const {WorldEventType} = require('@Lib/tanks/lib/data/worldevent/WorldEventType.js');

function create(tanks) {
  return WorldEvent(WorldEventType.RESET_TANKS, { tanks });
}
module.exports.create = create;
