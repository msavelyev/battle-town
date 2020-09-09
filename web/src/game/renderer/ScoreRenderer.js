import {OFFSET_Y, renderText} from './text.js';
import World from '../../../../lib/src/World.js';

export default class ScoreRenderer {

  constructor(ctx, match, position) {
    this.ctx = ctx;
    this.match = match;
    this.position = position;
  }

  update() {
    let offset = 0;

    for (let [id, score] of Object.entries(this.match.score)) {
      const tank = World.findTank(this.match.world, id);
      if (!tank) {
        continue;
      }
      const text = `${this.trimName(tank.name)}: ${score}`;

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
