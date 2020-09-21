import WorldEvent from './WorldEvent.js';
import WorldEventType from './WorldEventType.js';

export default class TankUpdate extends WorldEvent {

  constructor(id, position, name, direction, state) {
    super(WorldEventType.TANK_UPDATE);
    this.id = id;
    this.position = position;
    this.name = name;
    this.direction = direction;
    this.state = state;
  }

  static fromTank(tank) {
    return new TankUpdate(tank.id, tank.position, tank.name, tank.direction, tank.state);
  }

}
