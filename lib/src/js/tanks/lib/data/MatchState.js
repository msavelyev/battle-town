const {FPS} = require('@Lib/tanks/lib/Ticker.js');
const dotenv = require('@Lib/tanks/lib/util/dotenv.js');
const immutable = require('@Lib/tanks/lib/util/immutable.js');

const DATA = immutable.freeze({
  WAITING_FOR_PLAYERS: {
    movable: true,
    shootable: true,
  },
  PREPARE: {
    duration: 2,
    movable: false,
    shootable: false,
  },
  READY: {
    duration: 3,
    movable: false,
    shootable: false,
  },
  PLAY: {
    movable: true,
    shootable: true,
  },
  SCORE: {
    duration: 3,
    movable: true,
    shootable: true,
  },
  FINISHED: {
    duration: 5,
    movable: true,
    shootable: true,
  }
});

/**
 *
 * @name MatchState
 * @enum {string}
 */
const state = immutable.freeze({
  WAITING_FOR_PLAYERS: 'WAITING_FOR_PLAYERS',
  PREPARE: 'PREPARE',
  READY: 'READY',
  PLAY: 'PLAY',
  SCORE: 'SCORE',
  FINISHED: 'FINISHED',
});
module.exports.state = state;

function getDuration(state) {
  return DATA[state].duration;
}

function nextStateOnTick(state, tick) {
  const duration = getDuration(state);
  if (!duration) {
    return null;
  }

  return tick + FPS * (dotenv.SETTINGS.SHORT_PHASES ? 1 : duration);
}
module.exports.nextStateOnTick = nextStateOnTick;

function movable(state) {
  return DATA[state].movable;
}
module.exports.movable = movable;

function shootable(state) {
  return DATA[state].shootable;
}
module.exports.shootable = shootable;
