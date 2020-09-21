import RoomEvent from './RoomEvent.js';
import RoomEventType from './RoomEventType.js';

export default class Connect extends RoomEvent {
  constructor(player) {
    super(RoomEventType.CONNECT);

    this.player = player;
  }
}
