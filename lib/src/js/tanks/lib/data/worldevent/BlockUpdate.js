const {copy} = require('@Lib/tanks/lib/util/immutable.js');
const {WorldEvent} = require('@Lib/tanks/lib/data/worldevent/WorldEvent.js');
const {WorldEventType} = require('@Lib/tanks/lib/data/worldevent/WorldEventType.js');

function create(id, position, blockType, size, state, subtype, stateSince) {
  return WorldEvent(WorldEventType.BLOCK_UPDATE, {
    id, position, blockType, size, state, subtype, stateSince
  });
}

function fromBlock(block) {
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
module.exports.fromBlock = fromBlock;

function toBlock(update, block) {
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
module.exports.toBlock = toBlock;
