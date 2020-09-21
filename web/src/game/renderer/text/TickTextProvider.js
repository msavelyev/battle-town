import {SETTINGS} from '../../../../../lib/src/util/dotenv.js';
import TextRenderProvider from './TextRenderProvider.js';

export default class TickTextProvider extends TextRenderProvider {

  constructor(match) {
    super();

    this.match = match;
  }

  update() {
    if (!SETTINGS.DEBUG_INFO) {
      return null;
    }

    return 'tick: ' + this.match.tick;
  }

}
