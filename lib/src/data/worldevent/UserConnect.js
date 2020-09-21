import WorldEvent from './WorldEvent.js';
import WorldEventType from './WorldEventType.js';

export default class UserConnect extends WorldEvent {

  constructor(id, name) {
    super(WorldEventType.USER_CONNECT);
    this.id = id;
    this.name = name;
  }

}
