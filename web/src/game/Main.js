import Game from './Game.js';
import Renderer from './Renderer.js';
import Client from './Client.js';

export default class Main {

  constructor() {
    this.client = new Client();
    this.client.onInit(this.init.bind(this));
  }

  start() {
    this.client.connect();
  }

  init(conf) {
    const loading = document.getElementById('loading');
    if (loading) {
      loading.remove();
    }

    const canvas = document.getElementById('canvas');
    canvas.width = conf.world.width;
    canvas.height = conf.world.height;

    const ctx = canvas.getContext('2d');

    const game = new Game(this.client, conf);
    this.client.onMove(game.onMove.bind(game));
    this.client.onConnected(game.onConnected.bind(game));
    this.client.onDisconnected(game.onDisconnected.bind(game));

    const renderer = new Renderer(ctx, game);
    renderer.start();

    document.addEventListener('keydown', event => {
      game.onkey(event);
    });
  }

}
