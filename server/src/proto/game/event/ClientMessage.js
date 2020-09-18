import RoomEvent from './RoomEvent.js';
import RoomEventType from './RoomEventType.js';

export default class ClientMessage extends RoomEvent {

  constructor(id, netMessage) {
    super(RoomEventType.CLIENT_MESSAGE);

    this.id = id;
    this.netMessage = netMessage;
  }

}
