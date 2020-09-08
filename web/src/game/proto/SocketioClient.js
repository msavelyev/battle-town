import io from 'socket.io-client';
import NetClient from './NetClient.js';
import NetMessage from '../../../../lib/src/proto/NetMessage.js';
import EventType from '../../../../lib/src/proto/EventType.js';

export default class SocketioClient extends NetClient {

  constructor() {
    super();

    this.socket = io(process.env.SERVER_WS_HOST, { autoConnect: false });
    this.lastTick = -1;
  }

  on(name, cb) {
    if (cb) {
      this.socket.on(name, msg => {
        if (msg) {
          this.lastTick = msg.tick;
          cb(msg);
        } else {
          cb();
        }
      });
    } else {
      this.socket.off(name);
    }
  }

  send(messageType, data) {
    this.socket.emit(EventType.MESSAGE, new NetMessage(null, this.lastTick, messageType, data));
  }

  sendMessage(netMessage) {
    this.socket.emit(EventType.MESSAGE, netMessage);
  }

  connect() {
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

}
