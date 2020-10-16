import {copy, freeze} from '@Lib/tanks/lib/util/immutable.js';
import { WorldEvent } from '@Lib/tanks/lib/data/worldevent/WorldEvent.js';
import { WorldEventType } from '@Lib/tanks/lib/data/worldevent/WorldEventType.js';

const BlockVisible = freeze({
  create(block, target) {
    return WorldEvent(WorldEventType.BLOCK_VISIBLE, {
      block,
      target,
    });
  },

  toBlock(update, block) {
    return copy(block, update.block);
  }
});

export default BlockVisible;
