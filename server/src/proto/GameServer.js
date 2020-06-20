import {v4 as uuid} from 'uuid';

import Configuration from '../../../lib/src/Configuration.js';
import Direction from '../../../lib/src/Direction.js';
import Point from '../../../lib/src/Point.js';
import randomColor from '../../../lib/src/randomColor.js';
import Tank from '../../../lib/src/Tank.js';
import TankMove from '../../../lib/src/TankMove.js';
import World from '../../../lib/src/World.js';
import initLevel from '../level.js';

const WIDTH = 800;
const HEIGHT = 576;

const world = new World(
  WIDTH,
  HEIGHT,
  initLevel(),
  []
);


export default class GameServer {

  static create(server) {
    server.onConnected(client => {
      console.log('connected');

      const id = uuid();
      const tank = new Tank(id, new Point(2, 2), randomColor(), Direction.UP);
      client.send('init', new Configuration(
        world,
        tank
      ));

      client.broadcast('connected', tank);

      world.addTank(tank);

      client.on('move', direction => {
        tank.move(direction);

        client.broadcast('move', new TankMove(id, direction));
      });

      client.on('disconnect', () => {
        console.log('disconnected');

        world.removeTank(id);

        client.broadcast('disconnected', id);
      })

      client.on('p', () => {
        client.send('p');
      });
    });
  }

}
