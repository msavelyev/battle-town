import RoomEvent from './RoomEvent.js';
import RoomEventType from './RoomEventType.js';

export default class Disconnect extends RoomEvent {
  constructor(player) {
    super(RoomEventType.DISCONNECT);

    this.player = player;
  }
}
