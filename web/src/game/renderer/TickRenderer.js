import {renderText} from './text.js';

export default class TickRenderer {

  constructor(ctx, match, client, position, size) {
    this.ctx = ctx;
    this.match = match;
    this.client = client;
    this.position = position;
    this.size = size;
  }

  update() {
    const pos = this.position(this.size);
    renderText(this.ctx, 'tick: ' + this.match.tick, pos.x, pos.y, this.size.unit);
  }

}
