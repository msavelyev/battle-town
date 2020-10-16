import {copy, freeze} from '../../util/immutable.js';
import { WorldEvent } from './WorldEvent.js';
import { WorldEventType } from './WorldEventType.js';

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
