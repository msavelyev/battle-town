import WorldEvent from './WorldEvent.js';
import WorldEventType from './WorldEventType.js';

export default class ExplosionRemove extends WorldEvent {

  constructor(id) {
    super(WorldEventType.EXPLOSION_REMOVE);
    this.id = id;
  }

}
