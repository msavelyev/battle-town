
export default class PingRenderer {

  constructor(ctx, client) {
    this.ctx = ctx;
    this.latency = -1;
    this.lastPing = new Date();
    this.timeout = null;

    this.client = client;
    this.client.onPong(this.pong.bind(this));

    this.ping();
  }

  ping() {
    this.lastPing = new Date();
    this.client.ping();
  }

  update() {
    const text = 'ping: ' + this.latency + 'ms';

    this.ctx.font = '15px monospace';

    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = 'white';
    this.ctx.strokeText(text, 5, 30);
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(text, 5, 30);

    this.ctx.lineWidth = 1;
  }

  pong() {
    this.latency = new Date() - this.lastPing;
    this.timeout = setTimeout(this.ping.bind(this), 1000);
  }

}
