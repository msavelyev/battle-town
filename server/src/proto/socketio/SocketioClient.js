import process from 'process';

import NetClient from '../base/NetClient.js';
import EventType from '../../../../lib/src/proto/EventType.js';

export default class SocketioClient extends NetClient {

  constructor(socket, ticker) {
    super();
    this.socket = socket;
    this.ticker = ticker;
    this.lag = process.env.WOBC_LAG === 'true';

    this.callbacks = {};

    this.socket.on(EventType.MESSAGE, this.handleMessage.bind(this));
  }

  send(netMessage) {
    if (this.lag) {
      setTimeout(() => {
        this.sendImmediately(netMessage);
      }, 150);
    } else {
      this.sendImmediately(netMessage);
    }
  }

  sendImmediately(netMessage) {
    this.socket.emit(EventType.MESSAGE, netMessage);
  }

  on(eventType, cb) {
    this.socket.on(eventType, cb);
  }

  onMessage(messageType, cb) {
    if (cb) {
      this.callbacks[messageType] = this.delayedCb(messageType, cb);
    } else {
      delete this.callbacks[messageType];
    }
  }

  delayedCb(name, cb) {
    return function() {
      if (this.lag) {
        setTimeout(() => {
          cb.apply(null, arguments);
        }, 150);
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

}
