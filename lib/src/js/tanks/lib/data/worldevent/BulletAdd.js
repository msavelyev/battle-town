const {WorldEvent} = require('@Lib/tanks/lib/data/worldevent/WorldEvent.js');
const {WorldEventType} = require('@Lib/tanks/lib/data/worldevent/WorldEventType.js');

function create(id, position, direction) {
  return WorldEvent(WorldEventType.BULLET_ADD, {
    id, position, direction
  });
}
module.exports.create = create;
