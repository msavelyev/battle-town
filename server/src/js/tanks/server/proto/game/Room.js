import Entity from '@Lib/tanks/lib/data/entity/Entity.js';
import Match from '@Lib/tanks/lib/data/Match.js';
import TickData from '@Lib/tanks/lib/data/TickData.js';
import World from '@Lib/tanks/lib/data/World.js';
import EntityState from '@Lib/tanks/lib/data/entity/EntityState.js';
import UserConnect from '@Lib/tanks/lib/data/worldevent/UserConnect.js';
import BlockUpdate from '@Lib/tanks/lib/data/worldevent/BlockUpdate.js';
import UserDisconnect from '@Lib/tanks/lib/data/worldevent/UserDisconnect.js';
import MessageType from '@Lib/tanks/lib/proto/MessageType.js';
import NetMessage from '@Lib/tanks/lib/proto/NetMessage.js';
import immutable from '@Lib/tanks/lib/util/immutable.js';
import log from '@Lib/tanks/lib/util/log.js';
import NetClient from '@Server/tanks/server/proto/base/NetClient.js';
import ClientMessage from '@Server/tanks/server/proto/game/event/ClientMessage.js';
import Connect from '@Server/tanks/server/proto/game/event/Connect.js';
import Disconnect from '@Server/tanks/server/proto/game/event/Disconnect.js';
import RoomEventType from '@Server/tanks/server/proto/game/event/RoomEventType.js';
import Player from '@Server/tanks/server/proto/game/Player.js';

import data from '@Cljs/code/tanks.lib.data.js';

export function create(id, tick) {
  return {
    id: id,
    players: [],
    match: Match.create(
      id,
      World.create(id),
      tick
    ),
    queue: [],
    finished: false,
    onConnect() { },
  };
}

export function size(room) {
  return room.players.length;
}

export function update(room, event, beforeWorld, onKill) {
  if (room.finished) {
    return;
  }

  const updates = [];
  room.match = Match.update(room.match, event, beforeWorld, onKill, updates);
  if (Match.finished(room.match)) {
    log.info('room is finished', room.id);
    room.finished = true;
  }

  for (let roomEvent of room.queue) {
    handleRoomEvent(room, roomEvent, event.tick, updates);
  }

  room.queue = [];

  broadcast(room, MessageType.TICK, playerId => {
    return TickData.create(
      event.tick,
      immutable.filter(updates, update => {
        return update.target === null || update.target === playerId;
      }),
      JSON.parse(JSON.stringify(room.match.ack)),
    )
  });
}

export function isEmpty(room) {
  if (room.players.length === 0) {
    return true;
  }

  // noinspection RedundantIfStatementJS
  if (room.players.length === 1 && room.players[0].user.id === 'bot') {
    return true;
  }

  return false;
}

export function add(room, player) {
  room.queue.push(Connect(player));
}

export function remove(room, player) {
  room.queue.push(Disconnect(player));
}

function broadcast(room, name, dataFn) {
  room.players.forEach(player => {
    const data = dataFn(player.user.id);
    NetClient.sendMessage(player.client, NetMessage(player.user.id, name, data));
  });
}

export function stop(room) {
  for (let player of room.players) {
    NetClient.disconnect(player.client);
  }

}

export function handleEvent(room, client, netMessage, id) {
  switch (netMessage.type) {
    case MessageType.MOVE:
    case MessageType.SHOOT:
      room.queue.push(ClientMessage(id, netMessage));
      break;
    case MessageType.PING:
      NetClient.sendMessage(client, NetMessage(null, MessageType.PING));
      break;
    default:
      console.error('Unknown message', netMessage);
  }
}

export function hasPlayer(room, player) {
  return room.players.find(p => p.user.id === player.user.id);
}

export function setLevel(room, blocks) {
  room.match = Match.resetLevel(room.match, blocks);
}

function handleRoomEvent(room, roomEvent, tick, updates) {
  switch (roomEvent.type) {
    case RoomEventType.CLIENT_MESSAGE:
      handleClientMessage(room, roomEvent.netMessage, updates);
      break;
    case RoomEventType.CONNECT:
    {
      const player = roomEvent.player;
      room.players.push(player);
      const user = player.user;
      log.info('added player', user.id, 'to room', room.id);
      room.match = Match.addUser(room.match, Player.shortUser(player), tick, updates);
      updates.push(UserConnect.create(user.id, user.name));
      room.onConnect(room, user.id, updates);
    }
      break;
    case RoomEventType.DISCONNECT:
    {
      const player = roomEvent.player;
      log.info('players', room.players.length, 'removing one', player.user.id);
      room.players = room.players.filter(p => p !== player);
      room.match = Match.removeTank(room.match, player.user.id, updates);
      updates.push(UserDisconnect.create(player.user.id));
    }
      break;
    case RoomEventType.REVIVE_BLOCKS:
      let world = room.match.world;
      for (let block of world.blocks) {
        if (block.state === EntityState.DEAD) {
          block = Entity.revive(block, tick);
          world = World.replaceBlock(world, block);
          updates.push(BlockUpdate.fromBlock(block));
        }
      }
      room.match = immutable.copy(room.match, {
        world
      });
      break;
  }
}

export function send(room, roomEvent) {
  room.queue.push(roomEvent);
}

function handleClientMessage(room, netMessage, updates) {
  switch (netMessage.type){
    case MessageType.SHOOT:
    case MessageType.MOVE:
      room.match = data.get_result(Match.handleEvent(room.match, netMessage, updates));
      break;
  }
}
