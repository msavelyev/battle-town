import RoomEvent from './RoomEvent.js';
import RoomEventType from './RoomEventType.js';

export default class ReviveBlocks extends RoomEvent {
  constructor() {
    super(RoomEventType.REVIVE_BLOCKS);
  }
}
