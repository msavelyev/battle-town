import {copy} from '../../../../../lib/src/util/immutable.js';
import RoomEvent from './RoomEvent.js';
import RoomEventType from './RoomEventType.js';

export default function(id, netMessage) {
  return copy(RoomEvent(RoomEventType.CLIENT_MESSAGE), {
    id,
    netMessage,
  });
}
