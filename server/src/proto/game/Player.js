import EventType from '../../../../lib/src/proto/EventType.js';

export default class Player {

  constructor(client) {
    this.client = client;
    this.user = null;
  }

  onAuth(cb) {
    if (this.onAuthCb) {
      this.client.off(EventType.AUTH, this.onAuthCb);
    }

    this.onAuthCb = cb;

    if (cb) {
      this.client.on(EventType.AUTH, this.onAuthCb);
    }
  }

  onDisconnect(cb) {
    if (this.onDisconnectCb) {
      this.client.off(EventType.DISCONNECT, this.onDisconnectCb);
    }

    this.onDisconnectCb = cb;

    if (cb) {
      this.client.on(EventType.DISCONNECT, this.onDisconnectCb);
    }
  }

  static user(player) {
    return {
      id: player.user.id,
      name: player.user.name
    };
  }

}
