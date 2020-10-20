import {freeze} from '@Lib/tanks/lib/util/immutable.js';

/**
 *
 * @name EntityState
 * @enum {string}
 */
const EntityState = freeze({
  ALIVE: 'alive',
  DEAD: 'dead',
  REVIVING: 'reviving',
});
export default EntityState;
