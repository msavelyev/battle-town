import WorldEvent from './WorldEvent.js';
import WorldEventType from './WorldEventType.js';

export default class ResetLevel extends WorldEvent {

  constructor(blocks) {
    super(WorldEventType.RESET_LEVEL);
    this.blocks = blocks;
  }

}
