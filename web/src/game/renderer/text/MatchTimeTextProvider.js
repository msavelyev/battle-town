import MatchState from '../../../../../lib/src/data/MatchState.js';
import {FPS} from '../../../../../lib/src/Ticker.js';
import {SETTINGS} from '../../../../../lib/src/util/dotenv.js';
import {convertToTime} from '../../../../../lib/src/util/time.js';
import TextRenderProvider from './TextRenderProvider.js';

const PREFIX = 'time left: ';

export default class MatchTimeTextProvider extends TextRenderProvider {

  constructor(match) {
    super();

    this.match = match;
  }

  update() {
    if (SETTINGS.GAME_MODE !== 'FFA') {
      return null;
    }

    if (this.match.state !== MatchState.PLAY) {
      return PREFIX + '--:--';
    }

    const ticksPassed = this.match.tick - this.match.stateSinceTick;
    const ticksLeft = SETTINGS.FFA_MATCH_LENGTH_SECONDS * FPS - ticksPassed;
    const secondsLeft = Math.floor(ticksLeft / FPS);

    return PREFIX + convertToTime(secondsLeft);
  }

}
