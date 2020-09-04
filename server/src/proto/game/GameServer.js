import {v4 as uuid} from 'uuid';

import * as process from 'process';
import { performance } from 'perf_hooks';

import Configuration from '../../../../lib/src/Configuration.js';
import Direction from '../../../../lib/src/Direction.js';
import Point from '../../../../lib/src/Point.js';
import randomColor from '../../../../lib/src/randomColor.js';
import Tank from '../../../../lib/src/Tank.js';
import TankMove from '../../../../lib/src/TankMove.js';
import Ticker from '../../../../lib/src/Ticker.js';
import Fps from '../../../../lib/src/util/Fps.js';
import Player from './Player.js';
import Room from './Room.js';
import MessageType from '../../../../lib/src/proto/MessageType.js';

export default class GameServer {

  constructor(server) {
    this.fps = new Fps();
    this.rooms = [];
    this.players = [];
    this.server = server;

    this.init();
  }

  init() {
    this.server.onConnected(this.clientConnected.bind(this));

    const ticker = new Ticker(this, setTimeout, performance.now);
    ticker.start();

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
    const room = new Room(id);
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

    const world = room.world;

    let tank = new Tank(id, new Point(2, 2), randomColor(), Direction.UP, false);
    tank = world.placeTank(tank);
    client.send(MessageType.INIT, new Configuration(world, tank));

    world.addTank(tank);

    room.broadcast(MessageType.CONNECTED, tank);

    client.on(MessageType.START_MOVING, direction => {
      direction = Direction.create(direction);
      const movedTank = world.startMoving(id, direction);

      room.broadcast(
        MessageType.START_MOVING,
        new TankMove(id, direction, movedTank.position)
      );
    });

    client.on(MessageType.STOP_MOVING, direction => {
      direction = Direction.create(direction);
      const stoppedTank = world.stopMoving(id, direction);

      room.broadcast(
        MessageType.STOP_MOVING,
        new TankMove(id, direction, stoppedTank.position)
      );
    });

    client.on(MessageType.DISCONNECT, () => {
      console.log('disconnected');

      world.removeTank(id, true);

      room.broadcast(MessageType.DISCONNECTED, id);

      this.removePlayer(player);
      this.removeFromRoom(room, player);
    });

    client.on(MessageType.SHOOT, () => {
      world.shoot(id);
      room.broadcast(MessageType.SHOOT, id);
    });

    client.on(MessageType.PING, () => {
      client.send(MessageType.PING);
    });

    world.onTankDestroyed((tank, bullet) => {
      room.broadcast(MessageType.KILLED, tank);

      const newTank = world.placeTank(tank);
      world.addTank(newTank);

      room.broadcast(MessageType.CONNECTED, newTank);
      room.broadcast(MessageType.SCORE, world.score);
      room.broadcast(MessageType.BULLET_EXPLODED, bullet.id);
    });
  }

  update(event) {
    this.rooms.forEach(room => room.update(event));
    this.fps.update(event);
  }

  printFps() {
    process.stdout.write(`FPS:${this.fps.fps}, tick:${this.ticker.tick}\r`);
  }

  static create(server) {
    return new GameServer(server);
  }

}
