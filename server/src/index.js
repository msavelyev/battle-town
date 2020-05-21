const http = require('http');

const Hello = require('../../lib/src/Hello');

const hello = new Hello('World!');

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end(hello.hello());
});
server.listen(8080);
console.log('listening on 8080')
