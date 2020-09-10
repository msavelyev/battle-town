import data from '../../env.js';
import process from 'process';

export const SETTINGS = {
  SCORE_TO_WIN: 3,
  SHORT_PHASES: false,
  USE_DEBUG_LEVEL: false,
  LAG: null,
  START_WITH_MATCHMAKING: false,
  SERVER_API_HOST: null,
  SERVER_WS_HOST: null,
  AMPLITUDE: true,
};

export default function () {

  for (let [key, value] of Object.entries(data)) {
    console.log('setting', key, 'to', value);
    SETTINGS[key] = value;
    process.env[key] = value;
  }

};
