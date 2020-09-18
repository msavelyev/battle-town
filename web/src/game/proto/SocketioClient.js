import io from 'socket.io-client';
import NetClient from './NetClient.js';
import NetMessage from '../../../../lib/src/proto/NetMessage.js';
import EventType from '../../../../lib/src/proto/EventType.js';
import {SETTINGS} from '../../../../lib/src/util/dotenv.js';
import NetUsage from './NetUsage.js';

export default class SocketioClient extends NetClient {

  constructor() {
    super();

    this.socket = io(SETTINGS.SERVER_WS_HOST, { autoConnect: false });
    this.usage = new NetUsage();
  }

  on(name, cb) {
    if (cb) {
      this.socket.on(name, msg => {
        this.usage.read(msg);

        cb(msg);
      });
    } else {
      this.socket.off(name);
    }
  }

  sendMessage(messageType, data) {
    this.sendNetMessage(new NetMessage(null, messageType, data));
  }

  sendNetMessage(netMessage) {
    this.sendEvent(EventType.MESSAGE, netMessage);
  }

  sendEvent(eventType, payload) {
    this.usage.write(payload);
    this.socket.emit(eventType, payload);
  }

  connect() {
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

}
