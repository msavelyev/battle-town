import * as Entity from '../../../../lib/src/data/entity/Entity.js';
import * as Match from '../../../../lib/src/data/Match.js';
import * as TickData from '../../../../lib/src/data/TickData.js';
import * as World from '../../../../lib/src/data/World.js';
import { EntityState } from '../../../../lib/src/data/entity/EntityState.js';
import * as UserConnect from '../../../../lib/src/data/worldevent/UserConnect.js';
import * as BlockUpdate from '../../../../lib/src/data/worldevent/BlockUpdate.js';
import * as UserDisconnect from '../../../../lib/src/data/worldevent/UserDisconnect.js';
import MessageType from '../../../../lib/src/proto/MessageType.js';
import { NetMessage } from '../../../../lib/src/proto/NetMessage.js';
import log from '../../../../lib/src/util/log.js';
import ClientMessage from './event/ClientMessage.js';
import Connect from './event/Connect.js';
import Disconnect from './event/Disconnect.js';
import RoomEventType from './event/RoomEventType.js';
import Player from './Player.js';

export default class Room {

  constructor(id, tick) {
    this.id = id;

    this.players = [];

    this.match = Match.create(
      id,
      World.create(id),
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

    for (let roomEvent of this.queue) {
      Room.handleRoomEvent(this, roomEvent, event.tick, updates);
    }

    this.queue = [];

    this.broadcast(MessageType.TICK, TickData.create(
      event.tick,
      updates,
      JSON.parse(JSON.stringify(this.match.ack)),
    ));
  }

  isEmpty() {
    if (this.players.length === 0) {
      return true;
    }

    // noinspection RedundantIfStatementJS
    if (this.players.length === 1 && this.players[0].user.id === 'bot') {
      return true;
    }

    return false;
  }

  add(player) {
    this.queue.push(new Connect(player));
  }

  remove(player) {
    this.queue.push(new Disconnect(player));
  }

  broadcast(name, data) {
    this.players.forEach(player => {
      player.client.sendMessage(NetMessage(player.user.id, name, data));
    });
  }

  stop() {
    for (let player of this.players) {
      player.client.disconnect();
    }

  }

  handleEvent(client, netMessage, id) {
    switch (netMessage.type) {
      case MessageType.MOVE:
      case MessageType.SHOOT:
        this.queue.push(new ClientMessage(id, netMessage));
        break;
      case MessageType.PING:
        client.sendMessage(NetMessage(null, MessageType.PING));
        break;
      default:
        console.error('Unknown message', netMessage);
    }
  }

  static hasPlayer(room, player) {
    return room.players.find(p => p.user.id === player.user.id);
  }

  static setLevel(room, blocks) {
    Match.resetLevel(room.match, blocks);
  }

  static handleRoomEvent(room, roomEvent, tick, updates) {
    switch (roomEvent.type) {
      case RoomEventType.CLIENT_MESSAGE:
        Room.handleClientMessage(room, roomEvent.netMessage, updates);
        break;
      case RoomEventType.CONNECT:
        {
          const player = roomEvent.player;
          room.players.push(player);
          const user = player.user;
          log.info('added player', user.id, 'to room', room.id);
          Match.addUser(room.match, Player.shortUser(player), tick, updates);
          updates.push(UserConnect.create(user.id, user.name));
        }
        break;
      case RoomEventType.DISCONNECT:
        {
          const player = roomEvent.player;
          log.info('players', room.players.length, 'removing one', player.user.id);
          room.players = room.players.filter(p => p !== player);
          const match = room.match;
          Match.removeTank(match, player.user.id, updates);
          updates.push(UserDisconnect.create(player.user.id));
        }
        break;
      case RoomEventType.REVIVE_BLOCKS:
        const world = room.match.world;
        for (let block of world.blocks) {
          if (block.state === EntityState.DEAD) {
            block = Entity.revive(block, tick);
            World.replaceBlock(world, block);
            updates.push(BlockUpdate.fromBlock(block));
          }
        }
        break;
    }
  }

  static send(room, roomEvent) {
    room.queue.push(roomEvent);
  }

  static handleClientMessage(room, netMessage, updates) {
    switch (netMessage.type){
      case MessageType.SHOOT:
      case MessageType.MOVE:
        const result = Match.handleEvent(room.match, netMessage);
        if (result) {
          updates.push(result);
        }
        break;
    }
  }

}
