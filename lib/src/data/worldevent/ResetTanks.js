import WorldEvent from './WorldEvent.js';
import WorldEventType from './WorldEventType.js';

export default class ResetTanks extends WorldEvent {

  constructor(tanks) {
    super(WorldEventType.RESET_TANKS);
    this.tanks = tanks;
  }

}
