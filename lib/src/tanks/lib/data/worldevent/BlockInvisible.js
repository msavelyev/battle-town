import {freeze} from '../../util/immutable.js';
import { WorldEvent } from './WorldEvent.js';
import { WorldEventType } from './WorldEventType.js';

const BlockInvisible = freeze({
  create(id, target) {
    return WorldEvent(WorldEventType.BLOCK_INVISIBLE, { id, target });
  }
});

export default BlockInvisible;
