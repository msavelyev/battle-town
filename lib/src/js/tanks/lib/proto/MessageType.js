import {freeze} from 'Lib/tanks/lib/util/immutable.js';

export default freeze({
  INIT: 'init',
  SYNC: 'sync',
  MOVE: 'move',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  PING: 'p',
  SHOOT: 'shoot',
  KILLED: 'killed',
  SCORE: 'score',
  BULLET_EXPLODED: 'bullet-exploded',
  TICK: 'tick',
});
