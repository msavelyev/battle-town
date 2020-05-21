import Game from "./game/Game";
import Renderer from "./game/Renderer";

const io = require('socket.io-client');

const WIDTH = 800;
const HEIGHT = 600;

window.addEventListener('load', () => {
  const socket = io('http://localhost:8080');

  const canvas = document.getElementById('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  const ctx = canvas.getContext('2d');

  const game = new Game(WIDTH, HEIGHT);
  const renderer = new Renderer(ctx, game);
  renderer.start();

  document.addEventListener('keydown', event => {
    game.onkey(event);
  });

});
