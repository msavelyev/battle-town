import WorldEvent from './WorldEvent.js';
import WorldEventType from './WorldEventType.js';

export default class BulletAdd extends WorldEvent {

  constructor(id, position, direction) {
    super(WorldEventType.BULLET_ADD);
    this.id = id;
    this.position = position;
    this.direction = direction;
  }

}
