import express from 'express';
import * as http from 'http'
import IO from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = IO(server);

app.get('/', (req, res) => {
  res.send('hello');
});

io.on('connection', (socket) => {
  console.log('connected');

  socket.on('disconnect', () => {
    console.log('disconnected');
  })
});


server.listen(8080, () => {
  console.log('listening on 8080');
});
