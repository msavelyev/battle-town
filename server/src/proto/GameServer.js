import {v4 as uuid} from 'uuid';

import * as process from 'process';

import Configuration from '../../../lib/src/Configuration.js';
import Direction from '../../../lib/src/Direction.js';
import Point from '../../../lib/src/Point.js';
import randomColor from '../../../lib/src/randomColor.js';
import Tank from '../../../lib/src/Tank.js';
import TankMove from '../../../lib/src/TankMove.js';
import Ticker from '../../../lib/src/Ticker.js';
import World from '../../../lib/src/World.js';
import initLevel from '../level.js';
import Fps from '../../../lib/src/util/Fps.js';

const WIDTH = 800;
const HEIGHT = 576;

export default class GameServer {

  constructor(world) {
    this.world = world;
    this.fps = new Fps();
  }

  update(event) {
    this.world.update(event);
    this.fps.update(event);
  }

  printFps() {
    process.stdout.write(`${this.fps.get()}\r`);
  }

  static create(server) {
    const world = new World(
      WIDTH,
      HEIGHT,
      initLevel(),
      [],
      []
    );

    server.onConnected(client => {
      const id = uuid();
      console.log('connected', id);

      const tank = new Tank(id, new Point(2, 2), randomColor(), Direction.UP);
      client.send('init', new Configuration(
        world,
        tank
      ));

      client.broadcast('connected', tank);

      world.addTank(tank);

      client.on('move', direction => {
        console.log('tank', id, 'move', direction);
        world.moveTank(id, direction);

        client.broadcast('move', new TankMove(id, direction));
      });

      client.on('disconnect', () => {
        console.log('disconnected');

        world.removeTank(id);

        client.broadcast('disconnected', id);
      });

      client.on('shoot', () => {
        world.shoot(id);
        client.broadcast('shoot', id);
      });

      client.on('p', () => {
        client.send('p');
      });
    });

    const gameServer = new GameServer(world);
    const ticker = new Ticker(gameServer, setImmediate);
    ticker.start();

    server.start();

    setInterval(gameServer.printFps.bind(gameServer), 1000);
  }

}
