const Hello = require('../../lib/src/Hello');

const io = require('socket.io-client');

const hello = new Hello('World!');

window.addEventListener('load', () => {
  const header = document.getElementById('header');
  header.innerText = hello.hello();

  const socket = io('http://localhost:8080');
});
