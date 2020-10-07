import copy from '../../util/copy.js';
import { WorldEvent } from './WorldEvent.js';
import { WorldEventType } from './WorldEventType.js';

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
