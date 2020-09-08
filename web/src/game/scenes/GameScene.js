import Main from '../Main.js';
import Sprites from '../renderer/Sprites.js';
import Scene from './Scene.js';

export default class GameScene extends Scene {

  constructor(overlay, spritesImg) {
    super();
    this.overlay = overlay;
    this.spritesImg = spritesImg;

    this.main = null;
  }

  setup(params) {
    const client = params.client;
    const conf = params.conf;

    this.overlay.innerHTML = '<canvas id="canvas"></canvas>';
    const canvas = document.getElementById('canvas');

    const sprites = new Sprites(this.spritesImg);
    sprites.init(() => {
      this.main = new Main(canvas, sprites, client);

      document.addEventListener('keydown', this.main.keydown.bind(this.main));
      document.addEventListener('keyup', this.main.keyup.bind(this.main));
      window.addEventListener('beforeunload', this.main.disconnect.bind(this.main));

      this.main.init(conf);
      this.main.start();
    });
  }

  teardown() {
    this.overlay.innerHTML = '';

    document.removeEventListener('keydown', this.main.keydown);
    document.removeEventListener('keyup', this.main.keyup);
    window.removeEventListener('beforeunload', this.main.disconnect);

    this.main.stop();
  }
}
