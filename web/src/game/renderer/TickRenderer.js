import {renderText} from './text.js';

export default class TickRenderer {

  constructor(ctx, world, client, position) {
    this.ctx = ctx;
    this.world = world;
    this.client = client;
    this.position = position;
  }

  update() {
    renderText(this.ctx, 'tick: ' + this.world.tick, this.position.x, this.position.y);
  }

}
