const {WorldEvent} = require('@Lib/tanks/lib/data/worldevent/WorldEvent.js');
const {WorldEventType} = require('@Lib/tanks/lib/data/worldevent/WorldEventType.js');

function create(id) {
  return WorldEvent(WorldEventType.BULLET_REMOVE, { id });
}
module.exports.create = create;
