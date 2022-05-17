import data from 'Lib/tanks/lib/env.js';
import process from 'process';

export const SETTINGS = {
  DB_PATH: null,
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
  GAME_MODE: 'PVE',
  UPDATE_WORLD_VISIBILITY: true, // should be `false` for other game modes
  FIXED_CAMERA: false, // shoule be `true` for other game modes
  FFA_MATCH_LENGTH_SECONDS: 1500,
  TELEGRAM_CHAT_ID: null,
  TELEGRAM_API_KEY: null
};

export function dotenv() {

  if (data.DEBUG_LOGGING) {
    SETTINGS.DEBUG_LOGGING = data.DEBUG_LOGGING;
  }

  for (let [key, value] of Object.entries(SETTINGS)) {
    if (data[key] !== undefined) {
      value = data[key];
    }

    if (process.env[key] !== undefined) {
      value = process.env[key];
    }

    if (SETTINGS[key] !== value) {
      console.log('setting', key, 'to', value);
      SETTINGS[key] = value;
    }
    process.env[key] = value;
  }

};
