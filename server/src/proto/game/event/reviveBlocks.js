import {copy} from '../../../../../lib/src/util/immutable.js';
import roomEvent from './roomEvent.js';
import RoomEventType from './RoomEventType.js';

export default function() {
  return copy(roomEvent(RoomEventType.REVIVE_BLOCKS), {});
}
