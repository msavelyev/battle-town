import {WorldEvent} from '@Lib/tanks/lib/data/worldevent/WorldEvent.js';
import {WorldEventType} from '@Lib/tanks/lib/data/worldevent/WorldEventType.js';

function create(id, position, tick) {
  return WorldEvent(WorldEventType.EXPLOSION_ADD, {
    id, position, tick
  });
}

export function fromExplosion(explosion) {
  return create(
    explosion.id,
    explosion.position,
    explosion.tick
  );
}
