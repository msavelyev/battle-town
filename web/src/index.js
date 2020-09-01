import Main from './game/Main';
import Sprites from './game/renderer/Sprites.js';

window.addEventListener('load', () => {
  const canvas = document.getElementById('canvas');

  const spritesImg = new Image();
  spritesImg.addEventListener('load', () => {
    const main = new Main(canvas, new Sprites(spritesImg));

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
  });
  spritesImg.src = document.getElementById('sprites').href;
});
