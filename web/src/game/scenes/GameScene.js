import Main from '../Main.js';
import Sprites from '../renderer/Sprites.js';
import Scene from './Scene.js';
import analytics from '../../../../lib/src/util/analytics.js';

export default class GameScene extends Scene {

  constructor(overlay, spritesImg) {
    super();
    this.overlay = overlay;
    this.spritesImg = spritesImg;

    this.main = null;
    this.onKeydown = null;
    this.onKeyup = null;
    this.onDisconnect = null;
  }

  setup(params) {
    analytics.log('GAME_SCENE_SETUP');

    const client = params.client;
    const conf = params.conf;

    this.overlay.innerHTML = '<canvas id="canvas"></canvas>';
    const canvas = document.getElementById('canvas');

    const sprites = new Sprites(this.spritesImg);
    sprites.init(() => {
      this.main = new Main(canvas, sprites, client, this.onFinishCb);

      this.onKeydown = this.main.keydown.bind(this.main);
      this.onKeyup = this.main.keyup.bind(this.main);
      this.onDisconnect = this.main.disconnect.bind(this.main);

      document.addEventListener('keydown', this.onKeydown);
      document.addEventListener('keyup', this.onKeyup);
      window.addEventListener('beforeunload', this.onDisconnect);

      this.main.init(conf);
      this.main.start();
    });
  }

  teardown() {
    this.overlay.innerHTML = '';

    document.removeEventListener('keydown', this.onKeydown);
    document.removeEventListener('keyup', this.onKeyup);
    window.removeEventListener('beforeunload', this.onDisconnect);

    this.main.stop();

    this.onKeydown = null;
    this.onKeyup = null;
    this.onDisconnect = null;
    this.main = null;
  }
}
