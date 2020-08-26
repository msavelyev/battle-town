import {v4 as uuid} from 'uuid';

import * as process from 'process';

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

    const ticker = new Ticker(this, setImmediate);
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

  clientConnected(client) {
    const id = uuid();
    console.log('connected', id);

    const player = new Player(id, client);
    this.addPlayer(player);

    const room = this.findRoom();
    room.add(player);

    const world = room.world;

    const tank = new Tank(id, new Point(2, 2), randomColor(), Direction.UP);
    client.send('init', new Configuration(world, tank));

    room.broadcast(player, 'connected', tank);

    world.addTank(tank);

    client.on('move', direction => {
      console.log('tank', id, 'move', direction);
      world.moveTank(id, direction);

      room.broadcast(player, 'move', new TankMove(id, direction));
    });

    client.on('disconnect', () => {
      console.log('disconnected');

      world.removeTank(id);

      room.broadcast(player, 'disconnected', id);

      this.removePlayer(player);
    });

    client.on('shoot', () => {
      world.shoot(id);
      room.broadcast(player, 'shoot', id);
    });

    client.on('p', () => {
      client.send('p');
    });
  }

  update(event) {
    this.rooms.forEach(room => room.update(event));
    this.fps.update(event);
  }

  printFps() {
    process.stdout.write(`${this.fps.get()}\r`);
  }

  static create(server) {
    return new GameServer(server);
  }

}
