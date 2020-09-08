import {v4 as uuid} from 'uuid';

import * as process from 'process';
import randomColor from '../../../../lib/src/randomColor.js';
import Tank from '../../../../lib/src/Tank.js';
import Fps from '../../../../lib/src/util/Fps.js';
import Player from './Player.js';
import Room from './Room.js';
import EventType from '../../../../lib/src/proto/EventType.js';
import database from '../../database.js';
import NetMessage from '../../../../lib/src/proto/NetMessage.js';
import MessageType from '../../../../lib/src/proto/MessageType.js';
import Configuration from '../../../../lib/src/Configuration.js';

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

  createMatch(players) {
    return () => {
      const room = this.createRoom();
      const world = room.lastWorld();
      for (let player of players) {
        const client = player.client;
        const user = player.user;

        room.add(player);

        client.sendMessage(
          new NetMessage(user.id, this.ticker.tick, MessageType.INIT, new Configuration(user.id, world))
        );
        const tank = world.placeTank(new Tank(user.id, null, randomColor(), null));
        world.addTank(tank);

        client.on(EventType.MESSAGE, netMessage => {
          room.handleEvent(client, netMessage);
        });

        player.onDisconnect(() => {
          console.log('disconnected from match', user.id);
          room.remove(player);
        });
      }
    };
  }

  authorizePlayer(player, user) {
    const client = player.client;
    player.user = user;

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
            throw new Error('Nothing found');
          }
        })
        .catch(err => {
          console.log('Couldn\'t find user', userId, token, err);
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
    this.rooms.forEach(room => room.update(event));
    this.fps.update(event);
  }

  printFps() {
    process.stdout.write(`FPS:${this.fps.fps}, tick:${this.ticker.tick}\r`);
  }

  stop() {
    clearInterval(this.printFpsInterval);
    clearInterval(this.matchmakingInterval);
  }

}
