import * as MatchState from '@Lib/tanks/lib/data/MatchState.js';
import * as Ticker from '@Lib/tanks/lib/Ticker.js';
import * as dotenv from '@Lib/tanks/lib/util/dotenv.js';
import * as time from '@Lib/tanks/lib/util/time.js';

const PREFIX = 'time left: ';

export default function(game) {
  return () => {
    if (dotenv.SETTINGS.GAME_MODE !== 'FFA') {
      return null;
    }

    if (game.match.state !== MatchState.state.PLAY) {
      return PREFIX + '--:--';
    }

    const match = game.match;

    const ticksPassed = match.tick - match.stateSinceTick;
    const ticksLeft = dotenv.SETTINGS.FFA_MATCH_LENGTH_SECONDS * Ticker.FPS - ticksPassed;
    const secondsLeft = Math.floor(ticksLeft / Ticker.FPS);

    return PREFIX + time.convertToTime(secondsLeft);
  };
}
