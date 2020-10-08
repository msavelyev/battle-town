import {SETTINGS} from '../../../../../lib/src/util/dotenv.js';
import TextRenderProvider from './TextRenderProvider.js';

export default class TickTextProvider extends TextRenderProvider {

  constructor(game) {
    super();

    this.game = game;
  }

  update() {
    if (!SETTINGS.DEBUG_INFO) {
      return null;
    }

    return 'tick: ' + this.game.match.tick;
  }

}
