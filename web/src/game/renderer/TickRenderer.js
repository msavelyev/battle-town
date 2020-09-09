import {renderText} from './text.js';

export default class TickRenderer {

  constructor(ctx, match, client, position) {
    this.ctx = ctx;
    this.match = match;
    this.client = client;
    this.position = position;
  }

  update() {
    renderText(this.ctx, 'tick: ' + this.match.tick, this.position.x, this.position.y);
  }

}
