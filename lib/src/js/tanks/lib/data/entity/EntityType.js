import {freeze} from 'Lib/tanks/lib/util/immutable.js';

/**
 *
 * @name EntityType
 * @enum {string}
 */
export const EntityType = freeze({
  BLOCK: 'BLOCK',
  TANK: 'TANK',
  BULLET: 'BULLET',
  EXPLOSION: 'EXPLOSION'
});
