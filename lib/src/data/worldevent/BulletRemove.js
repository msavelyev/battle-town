import WorldEvent from './WorldEvent.js';
import WorldEventType from './WorldEventType.js';

export default class BulletRemove extends WorldEvent {

  constructor(id) {
    super(WorldEventType.BULLET_REMOVE);
    this.id = id;
  }

}
