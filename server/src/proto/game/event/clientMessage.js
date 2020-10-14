import {copy} from '../../../../../lib/src/util/immutable.js';
import roomEvent from './roomEvent.js';
import RoomEventType from './RoomEventType.js';

export default function(id, netMessage) {
  return copy(roomEvent(RoomEventType.CLIENT_MESSAGE), {
    id,
    netMessage,
  });
}
