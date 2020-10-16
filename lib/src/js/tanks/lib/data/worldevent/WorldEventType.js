const {freeze} = require('@Lib/tanks/lib/util/immutable.js');

/**
 *
 * @enum
 * @name {WorldEventType}
 */
const WorldEventType = freeze({
  STATE: 'state',
  SCORE: 'score',
  BLOCK_REMOVE: 'block-remove',
  BLOCK_UPDATE: 'block-update',
  TANK_ADD: 'tank-add',
  TANK_REMOVE: 'tank-remove',
  TANK_UPDATE: 'tank-update',
  BULLET_ADD: 'bullet-add',
  BULLET_REMOVE: 'bullet-remove',
  BULLET_UPDATE: 'bullet-update',
  EXPLOSION_ADD: 'explosion-add',
  EXPLOSION_REMOVE: 'explosion-remove',
  RESET_LEVEL: 'reset-level',
  RESET_TANKS: 'reset-tanks',
  USER_CONNECT: 'user-connect',
  USER_DISCONNECT: 'user-disconnect',
  BLOCK_VISIBLE: 'block-visible',
  BLOCK_INVISIBLE: 'block-invisible',
});
module.exports.WorldEventType = WorldEventType;
