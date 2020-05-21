const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.send('hello');
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
