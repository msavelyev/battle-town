import IO from 'socket.io';
import NetServer from '../base/NetServer.js';
import SocketioClient from './SocketioClient.js';

export default class SocketioServer extends NetServer {

  constructor(server) {
    super();

    this.io = IO(server);
  }

  start() {

  }

  onConnected(cb) {
    this.io.on('connection', (socket) => {
      cb(new SocketioClient(socket));
    });
  }
}
