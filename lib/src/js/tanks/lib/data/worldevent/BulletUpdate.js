const {WorldEvent} = require('@Lib/tanks/lib/data/worldevent/WorldEvent.js');
const {WorldEventType} = require('@Lib/tanks/lib/data/worldevent/WorldEventType.js');

function create(id, position) {
  return WorldEvent(WorldEventType.BULLET_UPDATE, {
    id, position
  });
}
module.exports.create = create;
