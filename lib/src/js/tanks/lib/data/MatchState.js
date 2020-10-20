import {FPS} from '@Lib/tanks/lib/Ticker.js';
import * as dotenv from '@Lib/tanks/lib/util/dotenv.js';
import * as immutable from '@Lib/tanks/lib/util/immutable.js';

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
export const state = immutable.freeze({
  WAITING_FOR_PLAYERS: 'WAITING_FOR_PLAYERS',
  PREPARE: 'PREPARE',
  READY: 'READY',
  PLAY: 'PLAY',
  SCORE: 'SCORE',
  FINISHED: 'FINISHED',
});

function getDuration(state) {
  return DATA[state].duration;
}

export function nextStateOnTick(state, tick) {
  const duration = getDuration(state);
  if (!duration) {
    return null;
  }

  return tick + FPS * (dotenv.SETTINGS.SHORT_PHASES ? 1 : duration);
}

export function movable(state) {
  return DATA[state].movable;
}

export function shootable(state) {
  return DATA[state].shootable;
}
