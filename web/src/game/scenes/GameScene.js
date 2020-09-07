import Main from '../Main.js';
import Sprites from '../renderer/Sprites.js';
import Scene from './Scene.js';

export default class GameScene extends Scene {

  constructor(canvas, spritesImg) {
    super();
    this.canvas = canvas;
    this.spritesImg = spritesImg;
  }

  setup() {
    const main = new Main(this.canvas, new Sprites(this.spritesImg));
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
