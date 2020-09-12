import {v4 as uuid} from 'uuid';

import * as process from 'process';
import Fps from '../../../../lib/src/util/Fps.js';
import Player from './Player.js';
import Room from './Room.js';
import EventType from '../../../../lib/src/proto/EventType.js';
import database from '../../database.js';
import NetMessage from '../../../../lib/src/proto/NetMessage.js';
import MessageType from '../../../../lib/src/proto/MessageType.js';
import Configuration from '../../../../lib/src/data/Configuration.js';
import World from '../../../../lib/src/data/World.js';
import Match from '../../../../lib/src/data/Match.js';

export default class GameServer {

  constructor(server, ticker, db) {
    this.fps = new Fps();
    this.rooms = [];
    this.server = server;
    this.ticker = ticker;
    this.db = db;

    this.queue = [];

    this.init();

    this.printFpsInterval = null;
    this.matchmakingInterval = null;
  }

  init() {
    this.server.onConnected(this.clientConnected.bind(this));

    this.server.start();

    this.printFpsInterval = setInterval(this.printFps.bind(this), 1000);
    this.matchmakingInterval = setInterval(this.matchmake.bind(this), 1000);
  }

  createRoom() {
    const id = uuid();
    const room = new Room(id, this.ticker);
    console.log('created room', id);
    this.rooms.push(room);

    return room;
  }

  matchmake() {
    while (this.queue.length >= 2) {
      const players = this.queue.slice(0, 2);
      this.queue = this.queue.slice(2);

      console.log('matchmaking players', players.map(p => p.user.id));

      for (let player of players) {
        player.client.send(EventType.MATCH_FOUND);
        player.onDisconnect();
      }

      setTimeout(this.createMatch(players), 1000);
    }
  }

  removeFromRoom(room, player) {
    room.remove(player);
    if (room.isEmpty()) {
      console.log('removing room', room.id);
      room.stop();
      this.rooms = this.rooms.filter(r => r !== room);
    }
  }

  createMatch(players) {
    return () => {
      const room = this.createRoom();
      const match = room.lastMatch();
      for (let player of players) {
        const client = player.client;
        const user = player.user;

        room.add(player);

        client.sendMessage(
          new NetMessage(user.id, this.ticker.tick, MessageType.INIT, Configuration.n(user.id, match))
        );

        client.on(EventType.MESSAGE, netMessage => {
          room.handleEvent(client, netMessage);
        });

        player.onDisconnect(() => {
          console.log('disconnected from match', user.id);
          this.removeFromRoom(room, player);
        });
      }

      World.resetTanks(match.world, match);
    };
  }

  authorizePlayer(player, user) {
    const client = player.client;
    player.user = user;

    if (this.queue.find(p => p.user.id === user.id)) {
      player.client.disconnect();
      throw new Error('Already queued');
    }

    console.log('authorized', user.id);
    client.send(EventType.AUTH_ACK);
    this.queue.push(player);

    player.onDisconnect(() => {
      console.log('disconnected from queue', user.id);
      this.queue = this.queue.filter(p => p !== player);
    });
  }

  onPlayerAuth(player) {
    const client = player.client;

    return auth => {
      const userId = auth.id;
      const token = auth.token;

      database.findUser(this.db, userId, token)
        .then(user => {
          if (user) {
            this.authorizePlayer(player, user);
          } else {
            console.log();
            throw new Error('Couldn\'t find user');
          }
        })
        .catch(err => {
          console.log('Couldn\'t authorize', userId, token, err);
          client.disconnect();
        })
        .then(() => {
          player.onAuth();
        });
    };
  }

  clientConnected(client) {
    const player = new Player(client);
    console.log('connected');

    player.onAuth(this.onPlayerAuth(player));
  }

  update(event) {
    for (let room of this.rooms) {
      room.update(event);
      if (room.finished) {
        this.assignPoints(room.lastMatch());
        room.stop();
      }
    }
    this.fps.update(event);
  }

  printFps() {
    process.stdout.write(`FPS:${this.fps.fps}, tick:${this.ticker.tick}\r`);
  }

  stop() {
    clearInterval(this.printFpsInterval);
    clearInterval(this.matchmakingInterval);
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

}
