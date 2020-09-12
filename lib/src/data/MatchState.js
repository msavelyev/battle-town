import {FPS} from '../Ticker.js';
import {SETTINGS} from '../util/dotenv.js';

import Data from '../protobuf/Data.js';

const MatchState = Data.MatchState;

const DATA = Object.freeze({
  [MatchState.PREPARE]: {
    duration: 5,
    movable: false,
    shootable: false,
  },
  [MatchState.READY]: {
    duration: 3,
    movable: false,
    shootable: false,
  },
  [MatchState.PLAY]: {
    movable: true,
    shootable: true,
  },
  [MatchState.SCORE]: {
    duration: 3,
    movable: true,
    shootable: true,
  },
  [MatchState.FINISHED]: {
    duration: 5,
    movable: true,
    shootable: true,
  }
});

MatchState.duration = function(state) {
  return DATA[state].duration;
};

MatchState.nextStateOnTick = function(state, tick) {
  const duration = MatchState.duration(state);
  if (!duration) {
    return null;
  }

  return tick + FPS * (SETTINGS.SHORT_PHASES ? 1 : duration);
};

MatchState.movable = function(state) {
  return DATA[state].movable;
};

MatchState.shootable = function(state) {
  return DATA[state].shootable;
};

export default MatchState;
