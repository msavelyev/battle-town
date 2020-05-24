
export default class PingRenderer {

  constructor(client) {
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

  update(ctx, event) {
    const text = 'ping: ' + this.latency + 'ms';

    ctx.font = '20px monospace'

    ctx.lineWidth = 5;
    ctx.strokeStyle = 'white';
    ctx.strokeText(text, 5, 20);
    ctx.fillStyle = 'black';
    ctx.fillText(text, 5, 20);

    ctx.lineWidth = 1;
  }

  pong() {
    this.latency = new Date() - this.lastPing;
    this.timeout = setTimeout(this.ping.bind(this), 1000);
  }

}
