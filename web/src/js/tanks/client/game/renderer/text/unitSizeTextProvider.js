import * as dotenv from '@Lib/tanks/lib/util/dotenv.js';

export default function(game) {
  return () => {
    if (!dotenv.SETTINGS.DEBUG_INFO) {
      return null;
    }

    return 'unit-size: ' + game.size.unit;
  };
}
