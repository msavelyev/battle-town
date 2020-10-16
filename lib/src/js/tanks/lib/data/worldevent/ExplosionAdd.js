const {WorldEvent} = require('@Lib/tanks/lib/data/worldevent/WorldEvent.js');
const {WorldEventType} = require('@Lib/tanks/lib/data/worldevent/WorldEventType.js');

function create(id, position, tick) {
  return WorldEvent(WorldEventType.EXPLOSION_ADD, {
    id, position, tick
  });
}

function fromExplosion(explosion) {
  return create(
    explosion.id,
    explosion.position,
    explosion.tick
  );
}
module.exports.fromExplosion = fromExplosion;
