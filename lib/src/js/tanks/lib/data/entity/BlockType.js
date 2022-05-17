import {freeze} from 'Lib/tanks/lib/util/immutable.js';

/**
 *
 * @name BlockType
 * @enum {number}
 */
const BlockType = freeze({
  EMPTY: 0,
  STONE: 1,
  BRICK: 2,
  BRICK_TL: 2.1,
  BRICK_TR: 2.2,
  BRICK_BL: 2.3,
  BRICK_BR: 2.4,
  WATER: 3,
  JUNGLE: 4,
  SPAWN: 5,
});
export default BlockType;
