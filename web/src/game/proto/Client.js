import MessageType from '../../../../lib/src/proto/MessageType.js';
import EventType from '../../../../lib/src/proto/EventType.js';

export default class Client {

  constructor(netClient) {
    this.netClient = netClient;
    this.callbacks = {};

    this.netClient.on(EventType.MESSAGE, this.handleMessage.bind(this));
  }

  connect() {
    this.netClient.connect();
  }

  disconnect() {
    this.netClient.disconnect();
  }

  on(eventType, cb) {
    this.netClient.on(eventType, cb);
  }

  handleMessage(netMessage) {
    const messageType = netMessage.type;
    if (this.callbacks[messageType]) {
      this.callbacks[messageType](netMessage.data);
    }
  }

  onMessage(messageType, cb) {
    if (!cb) {
      delete this.callbacks[messageType];
    } else {
      this.callbacks[messageType] = cb;
    }
  }

  sendNetMessage(netMessage) {
    this.netClient.sendNetMessage(netMessage);
  }

  sendEvent(eventType, payload) {
    this.netClient.sendEvent(eventType, payload);
  }

  ping() {
    this.netClient.sendMessage(MessageType.PING);
  }

}
