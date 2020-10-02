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
  block.id = update.id;
  block.position = update.position;
  block.type = update.blockType;
  block.size = update.size;
  block.state = update.state;
  block.subtype = update.subtype;
  block.stateSince = update.stateSince;
}
