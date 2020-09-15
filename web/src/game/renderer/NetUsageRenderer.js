import {OFFSET_Y, renderText} from './text.js';

const LITERALS = [
  'b',
  'Kb',
  'Mb'
]

export default class NetUsageRenderer {

  constructor(ctx, client, position) {
    this.ctx = ctx;
    this.client = client;
    this.position = position;
  }

  update() {
    const usage = this.client.netClient.usage;
    renderText(this.ctx, 'in: ' + this.format(usage.last.read), this.position.x, this.position.y);
    renderText(this.ctx, 'out: ' + this.format(usage.last.write), this.position.x, this.position.y + OFFSET_Y);
  }

  format(value) {
    let power = 0;
    while (value > 1024) {
      value /= 1024;
      power += 1;
    }

    return `${Math.round(value * 100) / 100} ${LITERALS[power]}/s`;
  }

}
