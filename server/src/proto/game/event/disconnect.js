import {copy} from '../../../../../lib/src/util/immutable.js';
import roomEvent from './roomEvent.js';
import RoomEventType from './RoomEventType.js';

export default function(player) {
  return copy(roomEvent(RoomEventType.DISCONNECT), {
    player,
  });
}
