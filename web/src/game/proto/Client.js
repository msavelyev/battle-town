
export default class Client {

  constructor(netClient) {
    this.netClient = netClient;
  }

  connect() {
    this.netClient.connect();
  }

  onConnect(cb) {
    this.netClient.on('connect', cb);
  }

  onDisconnect(cb) {
    this.netClient.on('disconnect', cb);
  }

  onInit(cb) {
    this.netClient.on('init', cb);
  }

  onMove(cb) {
    this.netClient.on('move', cb);
  }

  onConnected(cb) {
    this.netClient.on('connected', cb);
  }

  onDisconnected(cb) {
    this.netClient.on('disconnected', cb);
  }

  onPong(cb) {
    this.netClient.on('p', cb);
  }

  move(direction) {
    this.netClient.send('move', direction);
  }

  ping() {
    this.netClient.send('p');
  }

}
