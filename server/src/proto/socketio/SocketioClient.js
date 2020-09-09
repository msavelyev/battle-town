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
      }, 150);
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
