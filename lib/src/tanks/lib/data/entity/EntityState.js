import {freeze} from '../../util/immutable.js';

/**
 *
 * @name EntityState
 * @enum {string}
 */
export const EntityState = freeze({
  ALIVE: 'alive',
  DEAD: 'dead',
  REVIVING: 'reviving',
});
