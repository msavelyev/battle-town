import MessageType from '../../../../../lib/src/proto/MessageType.js';
import TextRenderProvider from './TextRenderProvider.js';

export default class PingTextProvider extends TextRenderProvider {

  constructor(client) {
    super();

    this.lastPing = new Date();
    this.client = client;
    this.client.onMessage(MessageType.PING, this.pong.bind(this));

    this.ping();
  }

  ping() {
    this.lastPing = new Date();
    this.client.ping();
  }

  update() {
    return 'ping: ' + this.latency + 'ms';
  }

  pong() {
    this.latency = new Date() - this.lastPing;
    this.timeout = setTimeout(this.ping.bind(this), 1000);
  }

}
