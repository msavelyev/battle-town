const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const Hello = require('../../lib/src/Hello');

const hello = new Hello('World!');

app.get('/', (req, res) => {
  res.send(hello.hello());
});

io.on('connection', (socket) => {
  console.log('connected');

  socket.on('disconnect', () => {
    console.log('disconnected');
  })
});


http.listen(8080, () => {
  console.log('listening on 8080');
});
