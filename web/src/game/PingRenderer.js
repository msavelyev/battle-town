
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

  update(canvas, event) {
    const text = 'ping: ' + this.latency + 'ms';

    canvas.font = '20px monospace'

    canvas.lineWidth = 5;
    canvas.strokeStyle = 'white';
    canvas.strokeText(text, 5, 20);
    canvas.fillStyle = 'black';
    canvas.fillText(text, 5, 20);

    canvas.lineWidth = 1;
  }

  pong() {
    this.latency = new Date() - this.lastPing;
    this.timeout = setTimeout(this.ping.bind(this), 1000);
  }

}
