import {renderText} from './text.js';

export default class UnackedInputRenderer {

  constructor(ctx, match, position) {
    this.ctx = ctx;
    this.match = match;
    this.position = position;
  }

  update() {
    renderText(this.ctx, 'inputs: ' + this.match.unackedMessages.length, this.position.x, this.position.y);
  }

}
