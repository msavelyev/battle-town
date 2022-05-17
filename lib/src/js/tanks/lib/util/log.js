import * as dotenv from 'Lib/tanks/lib/util/dotenv.js';
import isBrowser from 'Lib/tanks/lib/util/isBrowser.js';

function nope() {
  return isBrowser() && !dotenv.SETTINGS.DEBUG_LOGGING;
}

function prepareArgs(args) {
  const result = [];
  result.push(`[${new Date().toISOString()}]`);
  for (let i = 0; i < args.length; i++) {
    result.push(args[i]);
  }

  return result;
}

function log(logger, args) {
  if (nope()) {
    return;
  }

  logger.apply(console, prepareArgs(args));
}

export default Object.freeze({
  info: function() {
    log(console.info, arguments);
  },
  error: function() {
    log(console.error, arguments);
  },
});
