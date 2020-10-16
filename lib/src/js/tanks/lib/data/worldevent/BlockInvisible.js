const {freeze} = require('@Lib/tanks/lib/util/immutable.js');
const {WorldEvent} = require('@Lib/tanks/lib/data/worldevent/WorldEvent.js');
const {WorldEventType} = require('@Lib/tanks/lib/data/worldevent/WorldEventType.js');

const BlockInvisible = freeze({
  create(id, target) {
    return WorldEvent(WorldEventType.BLOCK_INVISIBLE, { id, target });
  }
});

module.exports = BlockInvisible;
