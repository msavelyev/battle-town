import MessageType from '../../../../lib/src/proto/MessageType.js';
import {renderText} from './text.js';

export default class PingRenderer {

  constructor(ctx, position, client, size) {
    this.ctx = ctx;
    this.position = position;
    this.latency = -1;
    this.lastPing = new Date();
    this.timeout = null;
    this.size = size;

    this.client = client;
    this.client.onMessage(MessageType.PING, this.pong.bind(this));

    this.ping();
  }

  ping() {
    this.lastPing = new Date();
    this.client.ping();
  }

  update() {
    const pos = this.position(this.size);
    renderText(this.ctx, 'ping: ' + this.latency + 'ms', pos.x, pos.y, this.size.unit);
  }

  pong() {
    this.latency = new Date() - this.lastPing;
    this.timeout = setTimeout(this.ping.bind(this), 1000);
  }

}
