export default class TickRenderer {

  constructor(ctx, world, client) {
    this.ctx = ctx;
    this.world = world;
    this.client = client;
  }

  update() {
    const x = 120;
    this.drawText('world: ' + this.world.tick, x, 12);
    this.drawText('server: ' + this.client.netClient.lastTick, x, 27);
  }

  drawText(text, x, y) {
    this.ctx.font = '15px monospace';

    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = 'white';
    this.ctx.strokeText(text, x, y);
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(text, x, y);

    this.ctx.lineWidth = 1;
  }

}
