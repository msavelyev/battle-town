import io from 'socket.io-client';

export default class Client {

  constructor() {
    this.socket = io('http://localhost:8080', { autoConnect: false });
  }

  on(event, cb) {
    if (cb) {
      this.socket.on(event, cb);
    } else {
      this.socket.off(event);
    }
  }

  connect() {
    this.socket.connect();
  }

  onConnect(cb) {
    this.on('connect', cb);
  }

  onDisconnect(cb) {
    this.on('disconnect', cb);
  }

  onInit(cb) {
    this.on('init', cb);
  }

  onMove(cb) {
    this.on('move', cb);
  }

  onConnected(cb) {
    this.on('connected', cb);
  }

  onDisconnected(cb) {
    this.on('disconnected', cb);
  }

  onPong(cb) {
    this.on('p', cb);
  }

  move(direction) {
    this.socket.emit('move', direction);
  }

  ping() {
    this.socket.emit('p');
  }

}
