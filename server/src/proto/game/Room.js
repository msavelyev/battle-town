import Match from '../../../../lib/src/data/Match.js';
import TickData from '../../../../lib/src/data/TickData.js';
import World from '../../../../lib/src/data/World.js';
import MessageType from '../../../../lib/src/proto/MessageType.js';
import NetMessage from '../../../../lib/src/proto/NetMessage.js';
import level from '../../level.js';
import Player from './Player.js';

const WIDTH = 800;
const HEIGHT = 576;

export default class Room {

  constructor(id, ticker) {
    this.id = id;
    this.ticker = ticker;

    this.players = [];

    this.match = new Match(
      id,
      new World(id, WIDTH, HEIGHT),
      ticker.tick
    );
    this.queue = [];

    this.finished = false;
  }

  update(event) {
    if (this.finished) {
      return;
    }

    const updates = Match.update(this.match, event);
    if (Match.finished(this.match)) {
      console.log('room is finished', this.id);
      this.finished = true;
    }

    for (let netMessage of this.queue) {
      switch (netMessage.type){
        case MessageType.SHOOT:
        case MessageType.MOVE:
          const result = Match.handleEvent(this.match, netMessage);
          if (result) {
            updates.push(result);
          }
          break;
      }
    }

    this.queue = [];

    this.broadcast(MessageType.TICK, new TickData(
      event.tick,
      updates,
      JSON.parse(JSON.stringify(this.match.ack)),
    ));
  }

  isEmpty() {
    return this.players.length === 0;
  }

  add(player) {
    this.players.push(player);
    console.log('added player', player.user.id, 'to room', this.id);
    Match.addUser(this.match, Player.shortUser(player));
  }

  remove(player) {
    console.log('players', this.players.length, 'removing one', player.user.id);
    this.players = this.players.filter(p => p !== player);
    const match = this.match;
    Match.removeTank(match, player.user.id, true);
    if (!this.finished) {
      const player = this.players[0];
      if (player) {
        Match.setWinner(match, player.user.id, match.tick);
      }
    }

    this.broadcast(MessageType.DISCONNECTED, player.user.id);
  }

  broadcast(name, data, tick) {
    if (!tick) {
      tick = this.ticker.tick;
    }

    this.players.forEach(player => {
      player.client.sendMessage(new NetMessage(player.user.id, tick, name, data));
    });
  }

  stop() {
    for (let player of this.players) {
      player.client.disconnect();
    }

  }

  handleEvent(client, netMessage) {
    switch (netMessage.type) {
      case MessageType.MOVE:
      case MessageType.SHOOT:
        this.queue.push(netMessage);
        break;
      case MessageType.PING:
        client.sendMessage(new NetMessage(null, this.ticker.tick, MessageType.PING));
        break;
      default:
        console.error('Unknown message', netMessage);
    }
  }

}
