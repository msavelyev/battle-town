import {renderText} from './text.js';

export default class UnackedInputRenderer {

  constructor(ctx, match, position, size) {
    this.ctx = ctx;
    this.match = match;
    this.position = position;
    this.size = size;
  }

  update() {
    const pos = this.position(this.size);
    renderText(this.ctx, 'inputs: ' + this.match.unackedMessages.length, pos.x, pos.y, this.size.unit);
  }

}
