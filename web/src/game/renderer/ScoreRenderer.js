import {OFFSET_Y, renderText} from './text.js';
import Match from '../../../../lib/src/Match.js';

export default class ScoreRenderer {

  constructor(ctx, match, position) {
    this.ctx = ctx;
    this.match = match;
    this.position = position;
  }

  update() {
    let offset = 0;

    for (let [id, score] of Object.entries(this.match.score)) {
      const user = Match.findUser(this.match, id);
      const text = `${this.trimName(user.name)}: ${score}`;

      renderText(this.ctx, text, this.position.x, this.position.y + offset);

      offset += OFFSET_Y;
    }
  }

  trimName(name) {
    if (name.length <= 13) {
      return name;
    } else {
      return name.substr(0, 12) + '…';
    }
  }

}
