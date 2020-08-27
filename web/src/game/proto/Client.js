import MessageType from '../../../../lib/src/proto/MessageType.js';

export default class Client {

  constructor(netClient) {
    this.netClient = netClient;
  }

  connect() {
    this.netClient.connect();
  }

  disconnect() {
    this.netClient.disconnect();
  }

  on(messageType, cb) {
    this.netClient.on(messageType, cb);
  }

  move(direction) {
    this.netClient.send(MessageType.MOVE, direction);
  }

  shoot() {
    this.netClient.send(MessageType.SHOOT);
  }

  ping() {
    this.netClient.send(MessageType.PING);
  }

}
