import * as MatchState from '../../../../../lib/src/tanks/lib/data/MatchState.js';
import {FPS} from '../../../../../lib/src/tanks/lib/Ticker.js';
import {SETTINGS} from '../../../../../lib/src/tanks/lib/util/dotenv.js';
import {convertToTime} from '../../../../../lib/src/tanks/lib/util/time.js';

const PREFIX = 'time left: ';

export default function(game) {
  return () => {
    if (SETTINGS.GAME_MODE !== 'FFA') {
      return null;
    }

    if (game.match.state !== MatchState.state.PLAY) {
      return PREFIX + '--:--';
    }

    const match = game.match;

    const ticksPassed = match.tick - match.stateSinceTick;
    const ticksLeft = SETTINGS.FFA_MATCH_LENGTH_SECONDS * FPS - ticksPassed;
    const secondsLeft = Math.floor(ticksLeft / FPS);

    return PREFIX + convertToTime(secondsLeft);
  };
}
