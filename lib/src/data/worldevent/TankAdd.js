import WorldEvent from './WorldEvent.js';
import WorldEventType from './WorldEventType.js';

export default class TankAdd extends WorldEvent {

  constructor(id, position, name, direction, state) {
    super(WorldEventType.TANK_ADD);
    this.id = id;
    this.position = position;
    this.name = name;
    this.direction = direction;
    this.state = state;
  }

  static fromTank(tank) {
    return new TankAdd(tank.id, tank.position, tank.name, tank.direction, tank.state);
  }

}
