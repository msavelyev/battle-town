import NetClient from '../base/NetClient.js';

export default class WrtcClient extends NetClient {

  constructor(connection, otherClients) {
    super();

    this.connection = connection;
    this.otherClients = otherClients;
    this.dataChannel = connection.createDataChannel('hello');
    this.callbacks = {};

    this.dataChannel.addEventListener('message', msg => {
      const payload = msg.data;

      const {name, data} = JSON.parse(payload);
      this.trigger(name, data);
    });
  }

  send(name, data) {
    this.dataChannel.send(JSON.stringify({name, data}));
  }

  broadcast(name, data) {
    this.otherClients(client => {
      client.send(name, data);
    });
  }

  on(name, cb) {
    this.callbacks[name] = cb;
  }

  trigger(name, data) {
    if (this.callbacks[name]) {
      this.callbacks[name](data);
    }
  }

}
