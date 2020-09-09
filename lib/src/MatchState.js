import {FPS} from './Ticker.js';

const DATA = Object.freeze({
  PREPARE: {
    duration: 5,
    movable: true,
  },
  READY: {
    duration: 3,
    movable: false,
  },
  PLAY: {
    movable: true,
  },
  SCORE: {
    duration: 3,
    movable: true,
  },
  FINISHED: {
    duration: 5,
    movable: true,
  }
});

export default class MatchState {

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

    return tick + FPS * duration;
  }

  static movable(state) {
    return DATA[state].movable;
  }

}
