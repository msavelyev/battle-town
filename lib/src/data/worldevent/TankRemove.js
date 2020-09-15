import WorldEvent from './WorldEvent.js';
import WorldEventType from './WorldEventType.js';

export default class TankRemove extends WorldEvent {
  constructor(id) {
    super(WorldEventType.TANK_REMOVE);
    this.id = id;
  }
}
