import data from '../../env.js';
import process from 'process';
import log from './log.js';

export const SETTINGS = {
  SCORE_TO_WIN: 3,
  SHORT_PHASES: false,
  USE_LEVEL: null,
  LAG: null,
  START_WITH_MATCHMAKING: false,
  SERVER_API_HOST: null,
  SERVER_WS_HOST: null,
  AMPLITUDE: true,
  DEBUG_RENDER: false,
  DEBUG_INFO: false,
  DEBUG_LOGGING: false,
  ALLOW_SINGLE: false,
  GAME_MODE: 'FFA',
  FFA_MATCH_LENGTH_SECONDS: 1500,
};

export default function () {

  if (data.DEBUG_LOGGING) {
    SETTINGS.DEBUG_LOGGING = data.DEBUG_LOGGING;
  }

  for (let [key, value] of Object.entries(data)) {
    log.info('setting', key, 'to', value);
    SETTINGS[key] = value;
    process.env[key] = value;
  }

};
