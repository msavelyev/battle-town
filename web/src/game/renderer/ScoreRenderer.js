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
      const text = `${id.substr(0, 8)}: ${score}`;

      renderText(this.ctx, text, this.position.x, this.position.y + offset);

      offset += OFFSET_Y;
    }
  }

}
