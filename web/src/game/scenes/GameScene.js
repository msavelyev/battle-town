import Main from '../Main.js';
import * as sprites from '../renderer/sprites.js';
import Scene from './Scene.js';
import analytics from '../../../../lib/src/tanks/lib/util/analytics.js';

export default class GameScene extends Scene {

  constructor(overlay, spriteSheet) {
    super();
    this.overlay = overlay;
    this.spriteSheet = spriteSheet;

    this.size = null
    this.main = null;
    this.onKeydown = null;
    this.onKeyup = null;
    this.onTouchStart = null;
    this.onTouchMove = null;
    this.onTouchEnd = null;
    this.onTouchCancel = null;
    this.onDisconnect = null;
  }

  setup(params, size) {
    analytics.log('GAME_SCENE_SETUP');

    const client = params.client;
    const conf = params.conf;
    this.size = size;

    this.overlay.innerHTML = '<canvas id="canvas" style="flex: 1;"></canvas>';
    const canvas = document.getElementById('canvas');

    const spritesConf = sprites.configure(this.spriteSheet);
    this.main = new Main(canvas, spritesConf, client, this.size, this.onFinishCb);

    this.onDisconnect = this.main.disconnect.bind(this.main);
    window.addEventListener('beforeunload', this.onDisconnect);

    this.main.init(conf);

    const input = this.main.input;
    this.onKeydown = input.keydown.bind(input);
    this.onKeyup = input.keyup.bind(input);
    this.onTouchStart = input.touchstart.bind(input);
    this.onTouchMove = input.touchmove.bind(input);
    this.onTouchEnd = input.touchend.bind(input);
    this.onTouchCancel = input.touchcancel.bind(input);

    document.addEventListener('keydown', this.onKeydown);
    document.addEventListener('keyup', this.onKeyup);
    document.addEventListener('touchstart', this.onTouchStart);
    document.addEventListener('touchmove', this.onTouchMove);
    document.addEventListener('touchend', this.onTouchEnd);
    document.addEventListener('touchcancel', this.onTouchCancel);

    this.main.start();
  }

  teardown() {
    this.overlay.innerHTML = '';

    document.removeEventListener('keydown', this.onKeydown);
    document.removeEventListener('keyup', this.onKeyup);
    document.removeEventListener('touchstart', this.onTouchStart);
    document.removeEventListener('touchmove', this.onTouchMove);
    document.removeEventListener('touchend', this.onTouchEnd);
    document.removeEventListener('touchcancel', this.onTouchCancel);
    window.removeEventListener('beforeunload', this.onDisconnect);

    this.main.stop();

    this.onKeydown = null;
    this.onKeyup = null;
    this.onTouchStart = null;
    this.onTouchMove = null;
    this.onTouchEnd = null;
    this.onTouchCancel = null;
    this.onDisconnect = null;
    this.main = null;
  }

  resize(size) {
    this.main.resize(size);
  }
}
