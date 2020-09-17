import Match from '../../../../lib/src/data/Match.js';
import {renderText} from './text.js';

export default class ScoreRenderer {

  constructor(ctx, match, position, size) {
    this.ctx = ctx;
    this.match = match;
    this.position = position;
    this.size = size;
  }

  update() {
    let offset = 0;

    const pos = this.position(this.size);
    for (let [id, score] of Object.entries(this.match.score)) {
      const user = Match.findUser(this.match, id);
      const text = `${this.trimName(user.name)}: ${score}`;

      renderText(this.ctx, text, pos.x, pos.y + offset, this.size.unit);

      offset += this.size.unit;
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
