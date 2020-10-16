import EventType from '../../../../lib/src/tanks/lib/proto/EventType.js';
import BotClient from '../base/BotClient.js';
import NetClient from '../base/NetClient.js';

export default class Player {

  constructor(client) {
    this.client = client;
    this.user = null;
  }

  onAuth(cb) {
    if (this.onAuthCb) {
      NetClient.off(this.client, EventType.AUTH, this.onAuthCb);
    }

    this.onAuthCb = cb;

    if (cb) {
      NetClient.on(this.client, EventType.AUTH, this.onAuthCb);
    }
  }

  onDisconnect(cb) {
    if (this.onDisconnectCb) {
      NetClient.off(this.client, EventType.DISCONNECT, this.onDisconnectCb);
    }

    this.onDisconnectCb = cb;

    if (cb) {
      NetClient.on(this.client, EventType.DISCONNECT, this.onDisconnectCb);
    }
  }

  static shortUser(player) {
    return {
      id: player.user.id,
      name: player.user.name
    };
  }

  static bot() {
    const player = new Player(BotClient());
    player.user = {
      id: 'bot',
      name: 'I am a bot'
    }
    return player;
  }

}
