import {copy} from '@Lib/tanks/lib/util/immutable.js';
import RoomEvent from '@Server/tanks/server/proto/game/event/RoomEvent.js';
import RoomEventType from '@Server/tanks/server/proto/game/event/RoomEventType.js';

export default function() {
  return copy(RoomEvent(RoomEventType.REVIVE_BLOCKS), {});
}
