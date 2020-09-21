import WorldEvent from './WorldEvent.js';
import WorldEventType from './WorldEventType.js';

export default class BlockUpdate extends WorldEvent {

  constructor(id, position, blockType, size, state, subtype, stateSince) {
    super(WorldEventType.BLOCK_UPDATE);
    this.id = id;
    this.position = position;
    this.blockType = blockType;
    this.size = size;
    this.state = state;
    this.subtype = subtype;
    this.stateSince = stateSince;
  }

  static fromBlock(block) {
    return new BlockUpdate(
      block.id,
      block.position,
      block.type,
      block.size,
      block.state,
      block.subtype,
      block.stateSince
    );
  }

  static toBlock(update, block) {
    block.id = update.id;
    block.position = update.position;
    block.type = update.blockType;
    block.size = update.size;
    block.state = update.state;
    block.subtype = update.subtype;
    block.stateSince = update.stateSince;
  }
}


