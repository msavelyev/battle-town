import Main from '../Main.js';
import Sprites from '../renderer/Sprites.js';
import Scene from './Scene.js';

export default class GameScene extends Scene {

  constructor(overlay, spritesImg) {
    super();
    this.spritesImg = spritesImg;
  }

  setup() {
    this.overlay.innerHTML = '<canvas id="canvas"></canvas>';
    const canvas = document.getElementById('canvas');

    const main = new Main(canvas, new Sprites(this.spritesImg));
    main.onConnect(() => {
      document.getElementById('connected').classList.remove('inactive');
      document.getElementById('disconnected').classList.add('inactive');
    });
    main.onDisconnect(() => {
      document.getElementById('connected').classList.add('inactive');
      document.getElementById('disconnected').classList.remove('inactive');
    });

    document.addEventListener('keydown', event => {
      main.keydown(event);
    });

    document.addEventListener('keyup', event => {
      main.keyup(event);
    });

    window.addEventListener('beforeunload', () => {
      main.disconnect();
    });

    main.start();
  }

  teardown() {
  }
}
