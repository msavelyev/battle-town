import {FPS} from '../Ticker.js';
import {SETTINGS} from '../util/dotenv.js';

const DATA = Object.freeze({
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

export const state = Object.freeze({
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

export const duration = getDuration;

export function nextStateOnTick(state, tick) {
  const duration = getDuration(state);
  if (!duration) {
    return null;
  }

  return tick + FPS * (SETTINGS.SHORT_PHASES ? 1 : duration);
}

export function movable(state) {
  return DATA[state].movable;
}

export function shootable(state) {
  return DATA[state].shootable;
}
