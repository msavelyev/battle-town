import {v4 as uuid} from 'uuid';

import * as process from 'process';

import Configuration from '../../../../lib/src/Configuration.js';
import Direction from '../../../../lib/src/Direction.js';
import Point from '../../../../lib/src/Point.js';
import randomColor from '../../../../lib/src/randomColor.js';
import Tank from '../../../../lib/src/Tank.js';
import Fps from '../../../../lib/src/util/Fps.js';
import Player from './Player.js';
import Room from './Room.js';
import MessageType from '../../../../lib/src/proto/MessageType.js';
import EventType from '../../../../lib/src/proto/EventType.js';
import NetMessage from '../../../../lib/src/proto/NetMessage.js';

export default class GameServer {

  constructor(server, ticker) {
    this.fps = new Fps();
    this.rooms = [];
    this.players = [];
    this.server = server;
    this.ticker = ticker;

    this.init();
  }

  init() {
    this.server.onConnected(this.clientConnected.bind(this));

    this.server.start();

    setInterval(this.printFps.bind(this), 1000);
  }

  addPlayer(player) {
    this.players.push(player);
  }

  removePlayer(player) {
    this.players = this.players.filter(p => p !== player);
  }

  findRoom() {
    const result = this.rooms.find(room => !room.isFull());
    if (result) {
      return result;
    }

    const id = uuid();
    const room = new Room(id, this.ticker);
    console.log('created room', id);
    this.rooms.push(room);

    return room;
  }

  removeFromRoom(room, player) {
    room.remove(player);
    if (room.isEmpty()) {
      console.log('removing room', room.id);
      room.stop();
      this.rooms = this.rooms.filter(r => r !== room);
    }
  }

  findPlayer(id) {
    return this.players.find(player => player.id === id);
  }

  clientConnected(client) {
    const id = uuid();
    console.log('connected', id);

    const player = new Player(id, client);
    this.addPlayer(player);

    const room = this.findRoom();
    room.add(player);

    const world = room.lastWorld();

    let tank = new Tank(id, new Point(2, 2), randomColor(), Direction.UP, false);
    tank = world.placeTank(tank);
    client.send(new NetMessage(id, this.ticker.tick, MessageType.INIT, new Configuration(id, world)));

    world.addTank(tank);

    client.on(EventType.MESSAGE, netMessage => {
      room.handleEvent(client, netMessage);
    });

    client.on(EventType.DISCONNECT, () => {
      console.log('disconnected');

      room.lastWorld().removeTank(id, true);

      this.removePlayer(player);
      this.removeFromRoom(room, player);
    });
  }

  update(event) {
    this.rooms.forEach(room => room.update(event));
    this.fps.update(event);
  }

  printFps() {
    process.stdout.write(`FPS:${this.fps.fps}, tick:${this.ticker.tick}\r`);
  }

}
