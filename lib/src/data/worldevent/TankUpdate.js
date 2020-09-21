import WorldEvent from './WorldEvent.js';
import WorldEventType from './WorldEventType.js';

export default class TankUpdate extends WorldEvent {

  constructor(id, position, name, direction, state, stateSince) {
    super(WorldEventType.TANK_UPDATE);
    this.id = id;
    this.position = position;
    this.name = name;
    this.direction = direction;
    this.state = state;
    this.stateSince = stateSince;
  }

  static fromTank(tank) {
    return new TankUpdate(
      tank.id,
      tank.position,
      tank.name,
      tank.direction,
      tank.state,
      tank.stateSince
    );
  }

  static toTank(update, tank) {
    tank.id = update.id;
    tank.position = update.position;
    tank.name = update.name;
    tank.direction = update.direction;
    tank.state = update.state;
    tank.stateSince = update.stateSince;
  }

}
