import {copy} from '../../util/immutable.js';
import { WorldEvent } from './WorldEvent.js';
import { WorldEventType } from './WorldEventType.js';

function create(id, position, blockType, size, state, subtype, stateSince) {
  return WorldEvent(WorldEventType.BLOCK_UPDATE, {
    id, position, blockType, size, state, subtype, stateSince
  });
}

export function fromBlock(block) {
  return create(
    block.id,
    block.position,
    block.type,
    block.size,
    block.state,
    block.subtype,
    block.stateSince
  );
}

export function toBlock(update, block) {
  return copy(block, {
    id: update.id,
    position: update.position,
    type: update.blockType,
    size: update.size,
    state: update.state,
    subtype: update.subtype,
    stateSince: update.stateSince,
  });
}
