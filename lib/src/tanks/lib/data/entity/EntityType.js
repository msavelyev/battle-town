import {freeze} from '../../util/immutable.js';

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
