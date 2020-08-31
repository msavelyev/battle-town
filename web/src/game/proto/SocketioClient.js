import io from 'socket.io-client';
import NetClient from './NetClient.js';

export default class SocketioClient extends NetClient {

  constructor() {
    super();

    this.socket = io(process.env.SERVER_HOST, { autoConnect: false });
  }

  on(name, cb) {
    if (cb) {
      this.socket.on(name, cb);
    } else {
      this.socket.off(name);
    }
  }

  send(name, data) {
    this.socket.emit(name, data);
  }

  connect() {
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

}
