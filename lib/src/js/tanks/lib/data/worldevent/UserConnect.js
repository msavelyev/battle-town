const {WorldEvent} = require('@Lib/tanks/lib/data/worldevent/WorldEvent.js');
const {WorldEventType} = require('@Lib/tanks/lib/data/worldevent/WorldEventType.js');

function create(id, name) {
  return WorldEvent(WorldEventType.USER_CONNECT, {
    id, name
  });
}
module.exports.create = create;
