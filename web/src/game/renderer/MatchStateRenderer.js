import {renderText} from './text.js';
import Ticker from '../../../../lib/src/Ticker.js';

export default class MatchStateRenderer {

  constructor(ctx, match, position) {
    this.ctx = ctx;
    this.match = match;
    this.position = position;
  }

  update() {
    if (!this.match.nextStateOnTick) {
      return;
    }

    const countdown = Ticker.countdown(this.match.tick, this.match.nextStateOnTick);
    const text = `${this.match.state}: ${countdown}`;

    renderText(this.ctx, text, this.position.x, this.position.y, {
      size: 40,
      center: true,
      stroke: true
    });
  }

}
