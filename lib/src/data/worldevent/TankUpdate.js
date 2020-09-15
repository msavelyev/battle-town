import WorldEvent from './WorldEvent.js';
import WorldEventType from './WorldEventType.js';

export default class TankUpdate extends WorldEvent {

  constructor(id, position, name, direction) {
    super(WorldEventType.TANK_UPDATE);
    this.id = id;
    this.position = position;
    this.name = name;
    this.direction = direction;
  }

}
