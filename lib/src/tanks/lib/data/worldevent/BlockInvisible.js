import {freeze} from '@Lib/tanks/lib/util/immutable.js';
import { WorldEvent } from '@Lib/tanks/lib/data/worldevent/WorldEvent.js';
import { WorldEventType } from '@Lib/tanks/lib/data/worldevent/WorldEventType.js';

const BlockInvisible = freeze({
  create(id, target) {
    return WorldEvent(WorldEventType.BLOCK_INVISIBLE, { id, target });
  }
});

export default BlockInvisible;
