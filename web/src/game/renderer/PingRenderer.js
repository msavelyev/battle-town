import MessageType from '../../../../lib/src/proto/MessageType.js';
import {renderText} from './text.js';

export default class PingRenderer {

  constructor(ctx, position, client) {
    this.ctx = ctx;
    this.position = position;
    this.latency = -1;
    this.lastPing = new Date();
    this.timeout = null;

    this.client = client;
    this.client.onMessage(MessageType.PING, this.pong.bind(this));

    this.ping();
  }

  ping() {
    this.lastPing = new Date();
    this.client.ping();
  }

  update() {
    renderText(this.ctx, 'ping: ' + this.latency + 'ms', this.position.x, this.position.y);
  }

  pong() {
    this.latency = new Date() - this.lastPing;
    this.timeout = setTimeout(this.ping.bind(this), 1000);
  }

}
