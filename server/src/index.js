import express from 'express';
import * as http from 'http'
import IO from 'socket.io';
import {v4} from 'uuid';

import Configuration from '../../lib/src/Configuration.js';
import Direction from '../../lib/src/Direction.js';
import Point from '../../lib/src/Point.js';
import randomColor from '../../lib/src/randomColor.js';
import Tank from '../../lib/src/Tank.js';
import TankMove from '../../lib/src/TankMove.js';
import World from '../../lib/src/World.js';

const app = express();
const server = http.createServer(app);
const io = IO(server);

app.get('/', (req, res) => {
  res.send('hello');
});

const WIDTH = 800;
const HEIGHT = 600;

const world = new World(WIDTH, HEIGHT);

io.on('connection', (socket) => {
  console.log('connected');

  const id = v4();
  const tank = new Tank(id, new Point(0, 0), randomColor(), Direction.UP);
  socket.emit('init', new Configuration(
    WIDTH,
    HEIGHT,
    world.tanks,
    tank
  ));

  socket.broadcast.emit('connected', tank);

  world.addTank(tank);

  socket.on('move', direction => {
    tank.move(direction);
    console.log('moving ' + direction);

    socket.broadcast.emit('move', new TankMove(id, direction));
  });

  socket.on('disconnect', () => {
    console.log('disconnected');

    world.removeTank(id);

    socket.broadcast.emit('disconnected', id);
  })

});


server.listen(8080, () => {
  console.log('listening on 8080');
});
