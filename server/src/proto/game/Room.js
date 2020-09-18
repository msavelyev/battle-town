import Match from '../../../../lib/src/data/Match.js';
import TickData from '../../../../lib/src/data/TickData.js';
import World from '../../../../lib/src/data/World.js';
import MessageType from '../../../../lib/src/proto/MessageType.js';
import NetMessage from '../../../../lib/src/proto/NetMessage.js';
import log from '../../../../lib/src/util/log.js';
import Player from './Player.js';

export default class Room {

  constructor(id, tick) {
    this.id = id;

    this.players = [];

    this.match = new Match(
      id,
      new World(id),
      tick
    );
    this.queue = [];

    this.finished = false;
  }

  size() {
    return this.players.length;
  }

  update(event, beforeWorld, onKill) {
    if (this.finished) {
      return;
    }

    const updates = Match.update(this.match, event, beforeWorld, onKill);
    if (Match.finished(this.match)) {
      log.info('room is finished', this.id);
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
    if (this.players.length === 0) {
      return true;
    }

    if (this.players.length === 1 && this.players[0].user.id === 'bot') {
      return true;
    }

    return false;
  }

  add(player) {
    this.players.push(player);
    log.info('added player', player.user.id, 'to room', this.id);
    Match.addUser(this.match, Player.shortUser(player));
  }

  remove(player) {
    log.info('players', this.players.length, 'removing one', player.user.id);
    this.players = this.players.filter(p => p !== player);
    const match = this.match;
    Match.removeTank(match, player.user.id, true);

    this.broadcast(MessageType.DISCONNECTED, player.user.id);
  }

  broadcast(name, data) {
    this.players.forEach(player => {
      player.client.sendMessage(new NetMessage(player.user.id, name, data));
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
        client.sendMessage(new NetMessage(null, MessageType.PING));
        break;
      default:
        console.error('Unknown message', netMessage);
    }
  }

  static hasPlayer(room, player) {
    return room.players.find(p => p.user.id === player.user.id);
  }

  static setLevel(room, blocks) {
    World.resetLevel(room.match.world, blocks);
  }

}
