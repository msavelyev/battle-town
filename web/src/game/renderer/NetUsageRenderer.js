import {renderText} from './text.js';

const LITERALS = [
  'b',
  'Kb',
  'Mb'
]

export default class NetUsageRenderer {

  constructor(ctx, client, position, size) {
    this.ctx = ctx;
    this.client = client;
    this.position = position;
    this.size = size;
  }

  update() {
    const usage = this.client.netClient.usage;
    const pos = this.position(this.size);
    renderText(this.ctx, 'in: ' + this.format(usage.last.read), pos.x, pos.y, this.size.unit);
    renderText(this.ctx, 'out: ' + this.format(usage.last.write), pos.x, pos.y + this.size.unit, this.size.unit);
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
