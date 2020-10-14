import {copy} from '../../../../../lib/src/util/immutable.js';
import RoomEvent from './RoomEvent.js';
import RoomEventType from './RoomEventType.js';

export default function(player) {
  return copy(RoomEvent(RoomEventType.CONNECT), {
    player,
  });
}
