import WorldEvent from './WorldEvent.js';
import WorldEventType from './WorldEventType.js';

export default class BlockRemove extends WorldEvent {

  constructor(id) {
    super(WorldEventType.BLOCK_REMOVE);
    this.id = id;
  }

}
