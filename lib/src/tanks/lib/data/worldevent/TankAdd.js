import { copy } from '@Lib/tanks/lib/util/immutable.js';
import { WorldEvent } from '@Lib/tanks/lib/data/worldevent/WorldEvent.js';
import { WorldEventType } from '@Lib/tanks/lib/data/worldevent/WorldEventType.js';

function create(id, position, name, direction, state, stateSince) {
  return WorldEvent(WorldEventType.TANK_ADD, {
    id, position, name, direction, state, stateSince
  });
}

export function fromTank(tank) {
  return create(
    tank.id,
    tank.position,
    tank.name,
    tank.direction,
    tank.state,
    tank.stateSince
  );
}

export function toTank(update, tank) {
  return copy(tank, update);
}
