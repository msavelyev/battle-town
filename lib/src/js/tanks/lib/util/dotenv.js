export const SETTINGS = {
  PORT: 8080,
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

export const CLIENT_SETTINGS = [
  'SERVER_WS_HOST',
  'GAME_MODE',
  'FFA_MATCH_LENGTH_SECONDS',
  'DEBUG_INFO',
  'DEBUG_RENDER',
  'FIXED_CAMERA',
  'START_WITH_MATCHMAKING',
];

export function exportClient() {
  const result = {};
  for (let key of CLIENT_SETTINGS) {
    result[key] = SETTINGS[key];
  }

  return result;
}

export function dotenv(from) {
  if (from.DEBUG_LOGGING) {
    SETTINGS.DEBUG_LOGGING = from.DEBUG_LOGGING;
  }

  for (let [key, value] of Object.entries(SETTINGS)) {
    if (from[key] !== undefined) {
      value = from[key];
    }

    if (value === 'true') {
      value = true;
    } else if (value === 'false') {
      value = false;
    }

    if (SETTINGS[key] !== value) {
      console.log('setting', key, 'to', value);
      SETTINGS[key] = value;
    }
  }

};
