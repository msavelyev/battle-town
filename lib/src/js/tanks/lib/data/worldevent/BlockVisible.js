const {copy, freeze} = require('@Lib/tanks/lib/util/immutable.js');
const {WorldEvent} = require('@Lib/tanks/lib/data/worldevent/WorldEvent.js');
const {WorldEventType} = require('@Lib/tanks/lib/data/worldevent/WorldEventType.js');

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

module.exports = BlockVisible;
