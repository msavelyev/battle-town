const {freeze} = require('@Lib/tanks/lib/util/immutable.js');

/**
 *
 * @name EntityType
 * @enum {string}
 */
const EntityType = freeze({
  BLOCK: 'BLOCK',
  TANK: 'TANK',
  BULLET: 'BULLET',
  EXPLOSION: 'EXPLOSION'
});
module.exports.EntityType = EntityType;
