import WorldEvent from './WorldEvent.js';
import WorldEventType from './WorldEventType.js';

export default class UserDisconnect extends WorldEvent {

  constructor(id) {
    super(WorldEventType.USER_DISCONNECT);
    this.id = id;
  }

}
