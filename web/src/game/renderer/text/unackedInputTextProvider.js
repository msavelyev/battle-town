import {SETTINGS} from '../../../../../lib/src/tanks/lib/util/dotenv.js';

export default function(game) {
  return () => {
    if (!SETTINGS.DEBUG_INFO) {
      return null;
    }

    return 'inputs: ' + game.match.unackedMessages.length;
  };
}
