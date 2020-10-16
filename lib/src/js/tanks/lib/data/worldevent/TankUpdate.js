const {copy} = require('@Lib/tanks/lib/util/immutable.js');
const {WorldEvent} = require('@Lib/tanks/lib/data/worldevent/WorldEvent.js');
const {WorldEventType} = require('@Lib/tanks/lib/data/worldevent/WorldEventType.js');

function create(id, position, name, direction, state, stateSince) {
  return WorldEvent(WorldEventType.TANK_UPDATE, {
    id, position, name, direction, state, stateSince
  });
}

function fromTank(tank) {
  return create(
    tank.id,
    tank.position,
    tank.name,
    tank.direction,
    tank.state,
    tank.stateSince
  );
}
module.exports.fromTank = fromTank;

function toTank(update, tank) {
  return copy(tank, update);
}
module.exports.toTank = toTank;
