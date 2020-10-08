import {SETTINGS} from '../../../../../lib/src/util/dotenv.js';
import TextRenderProvider from './TextRenderProvider.js';

export default class UnackedInputTextProvider extends TextRenderProvider {

  constructor(game) {
    super();

    this.game = game;
  }

  update() {
    if (!SETTINGS.DEBUG_INFO) {
      return null;
    }

    return 'inputs: ' + this.game.match.unackedMessages.length;
  }

}
