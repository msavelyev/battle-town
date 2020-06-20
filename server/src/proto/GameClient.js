
export default class GameClient {

  constructor(socket) {
    this.socket = socket;
  }

  send(name, data) {
    this.socket.emit(name, data);
  }

  broadcast(name, data) {
    this.socket.broadcast.emit(name, data);
  }

  on(name, cb) {
    this.socket.on(name, cb);
  }

}
