import WorldEvent from './WorldEvent.js';
import WorldEventType from './WorldEventType.js';

export default class BulletUpdate extends WorldEvent {

  constructor(id, position) {
    super(WorldEventType.BULLET_UPDATE);
    this.id = id;
    this.position = position;
  }

}
