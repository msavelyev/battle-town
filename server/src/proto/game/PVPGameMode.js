import {v4 as uuid} from 'uuid';
import Configuration from '../../../../lib/src/data/Configuration.js';
import Match from '../../../../lib/src/data/Match.js';
import World from '../../../../lib/src/data/World.js';
import EventType from '../../../../lib/src/proto/EventType.js';
import MessageType from '../../../../lib/src/proto/MessageType.js';
import NetMessage from '../../../../lib/src/proto/NetMessage.js';
import {SETTINGS} from '../../../../lib/src/util/dotenv.js';
import log from '../../../../lib/src/util/log.js';
import database from '../../database.js';
import GameMode from './GameMode.js';
import Player from './Player.js';
import Room from './Room.js';

export default class PVPGameMode extends GameMode {

  constructor(db, ticker) {
    super();

    this.db = db;
    this.ticker = ticker;
    this.rooms = [];
    this.queue = [];
    this.matchmakingInterval = null;
  }

  init() {
    this.matchmakingInterval = setInterval(this.matchmake.bind(this), 1000);
  }

  matchmake() {
    while (this.queue.length >= 2) {
      const players = this.queue.slice(0, 2);
      this.queue = this.queue.slice(2);

      log.info('matchmaking players', players.map(p => p.user.id));

      for (let player of players) {
        player.client.send(EventType.MATCH_FOUND);
        player.onDisconnect();
      }

      setTimeout(this.createMatch(players), 1000);
    }
  }

  createMatch(players) {
    return () => {
      const room = this.createRoom();
      const match = room.match;
      for (let player of players) {
        const client = player.client;
        const user = player.user;

        room.add(player);

        client.on(EventType.MESSAGE, netMessage => {
          room.handleEvent(client, netMessage);
        });

        player.onDisconnect(() => {
          log.info('disconnected from match', user.id);
          this.removeFromRoom(room, player);
        });
      }

      World.resetTanks(match.world, match);

      for (let player of players) {
        const client = player.client;
        const user = player.user;

        client.sendMessage(
          new NetMessage(user.id, MessageType.INIT, new Configuration(user.id, match))
        );
      }
    };
  }

  createRoom() {
    const id = uuid();
    const room = new Room(id, this.ticker.tick);
    log.info('created room', id);
    this.rooms.push(room);

    return room;
  }

  removeFromRoom(room, player) {
    room.remove(player);
    if (room.isEmpty()) {
      log.info('removing room', room.id);
      room.stop();
      this.rooms = this.rooms.filter(r => r !== room);
    }
  }

  authorizePlayer(player, user) {
    const client = player.client;

    if (this.queue.find(p => p.user.id === user.id)) {
      player.client.disconnect();
      throw new Error('Already queued');
    }

    client.send(EventType.AUTH_ACK);
    this.queue.push(player);

    player.onDisconnect(() => {
      log.info('disconnected from queue', user.id);
      this.queue = this.queue.filter(p => p !== player);
    });

    if (SETTINGS.ALLOW_SINGLE) {
      this.queue.push(Player.bot());
    }
  }

  update(event) {
    for (let room of this.rooms) {
      room.update(event);
      if (room.finished) {
        this.assignPoints(room.match);
        room.stop();
      }
    }
  }

  assignPoints(match) {
    const winner = Match.winner(match).id;
    for (let user of match.users) {
      const points = user.id === winner ? 3 : 1;
      database.addPoints(this.db, user.id, points)
        .catch(err => {
          console.err(`Adding ${points} to user ${user.id}`, err);
        });
    }
  }

  stop() {
    clearInterval(this.matchmakingInterval);
  }

}
