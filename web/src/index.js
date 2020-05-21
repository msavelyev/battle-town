import Game from "./Game";
import Renderer from "./Renderer";

const Hello = require('../../lib/src/Hello');

const io = require('socket.io-client');

const hello = new Hello('World!');

const WIDTH = 800;
const HEIGHT = 600;

window.addEventListener('load', () => {
  const header = document.getElementById('header');
  header.innerText = hello.hello();

  const socket = io('http://localhost:8080');

  const canvas = document.getElementById('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  const ctx = canvas.getContext('2d');

  const renderer = new Renderer(new Game(ctx, WIDTH, HEIGHT));
  renderer.start();

});
