import io from 'socket.io-client';

export default class Client {

  constructor() {
    this.initCb = () => {};
  }

  connect() {
    this.socket = io('http://localhost:8080');
    this.socket.on('init', this.initCb);
  }

  onInit(cb) {
    this.initCb = cb;
  }

  onMove(cb) {
    this.socket.on('move', cb);
  }

  onConnected(cb) {
    this.socket.on('connected', cb);
  }

  onDisconnected(cb) {
    this.socket.on('disconnected', cb);
  }

  move(direction) {
    this.socket.emit('move', direction);
  }

}
