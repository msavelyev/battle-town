import immutable from '@Lib/tanks/lib/util/immutable.js';
import RoomEvent from '@Server/tanks/server/proto/game/event/RoomEvent.js';
import RoomEventType from '@Server/tanks/server/proto/game/event/RoomEventType.js';

export default function(id, netMessage) {
  return immutable.copy(RoomEvent(RoomEventType.CLIENT_MESSAGE), {
    id,
    netMessage,
  });
}
