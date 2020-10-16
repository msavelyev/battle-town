const {WorldEvent} = require('@Lib/tanks/lib/data/worldevent/WorldEvent.js');
const {WorldEventType} = require('@Lib/tanks/lib/data/worldevent/WorldEventType.js');

function create(blocks) {
  return WorldEvent(WorldEventType.RESET_LEVEL, { blocks });
}
module.exports.create = create;
