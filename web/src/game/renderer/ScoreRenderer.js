import {OFFSET_Y, renderText} from './text.js';

export default class ScoreRenderer {

  constructor(ctx, world, position) {
    this.ctx = ctx;
    this.world = world;
    this.position = position;
  }

  update() {
    let offset = 0;

    for (let [id, score] of Object.entries(this.world.score)) {
      const tank = this.world.findTank(id);
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
