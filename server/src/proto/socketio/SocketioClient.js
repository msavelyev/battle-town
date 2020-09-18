import EventType from '../../../../lib/src/proto/EventType.js';
import {SETTINGS} from '../../../../lib/src/util/dotenv.js';
import randomInt from '../../../../lib/src/util/randomInt.js';
import NetClient from '../base/NetClient.js';

export default class SocketioClient extends NetClient {

  constructor(socket) {
    super();
    this.socket = socket;
    this.lag = SETTINGS.LAG;

    this.callbacks = {};

    this.socket.on(EventType.MESSAGE, this.handleMessage.bind(this));
  }

  disconnect() {
    this.socket.disconnect();
  }

  sendMessage(netMessage) {
    this.send(EventType.MESSAGE, netMessage);
  }

  send(eventType, payload) {
    if (this.lag) {
      setTimeout(() => {
        this.sendImmediately(eventType, payload);
      }, this.lagValue());
    } else {
      this.sendImmediately(eventType, payload);
    }
  }

  sendImmediately(eventType, payload) {
    this.socket.emit(eventType, payload);
  }

  on(eventType, cb) {
    this.socket.on(eventType, cb);
  }

  off(eventType, cb) {
    this.socket.off(eventType, cb);
  }

  onMessage(messageType, cb) {
    if (cb) {
      this.callbacks[messageType] = this.delayedCb(messageType, cb);
    } else {
      delete this.callbacks[messageType];
    }
  }

  delayedCb(name, cb) {
    const that = this;
    return function() {
      if (that.lag) {
        setTimeout(() => {
          cb.apply(null, arguments);
        }, that.lagValue());
      } else {
        cb.apply(null, arguments);
      }
    };
  }

  handleMessage(netMessage) {
    const messageType = netMessage.type;
    if (this.callbacks[messageType]) {
      this.callbacks[messageType](netMessage);
    }
  }

  lagValue() {
    if (!this.lag) {
      return null;
    }

    if (this.lag === 'RANDOM') {
      return randomInt(50, 150);
    }

    return SETTINGS.LAG;
  }

}
