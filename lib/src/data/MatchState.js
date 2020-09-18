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

export default class MatchState {

  static get WAITING_FOR_PLAYERS() {
    return 'WAITING_FOR_PLAYERS';
  }

  static get PREPARE() {
    return 'PREPARE';
  }

  static get READY() {
    return 'READY';
  }

  static get PLAY() {
    return 'PLAY';
  }

  static get SCORE() {
    return 'SCORE';
  }

  static get FINISHED() {
    return 'FINISHED';
  }

  static duration(state) {
    return DATA[state].duration;
  }

  static nextStateOnTick(state, tick) {
    const duration = MatchState.duration(state);
    if (!duration) {
      return null;
    }

    return tick + FPS * (SETTINGS.SHORT_PHASES ? 1 : duration);
  }

  static movable(state) {
    return DATA[state].movable;
  }

  static shootable(state) {
    return DATA[state].shootable;
  }

}
