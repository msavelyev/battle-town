import MainMenu from './game/scenes/MainMenu.js';
import Loading from './game/scenes/Loading.js';
import GameScene from './game/scenes/GameScene.js';
import Scenes from './game/scenes/Scenes.js';
import Matchmaking from './game/scenes/Matchmaking.js';
import Disconnected from './game/scenes/Disconnected.js';
import userStorage from './game/userStorage.js';

import dotenv, {SETTINGS} from '../../lib/src/util/dotenv.js';
import analytics from '../../lib/src/util/analytics.js';

analytics.init();

dotenv();

function resizeOverlay(overlay) {
  const maxWidth = document.body.offsetWidth;
  const maxHeight = document.body.offsetHeight * 0.96;

  const newWidth = Math.floor(Math.min(maxWidth, maxHeight * 1.69));
  const newHeight = Math.floor(Math.min(maxHeight, maxWidth / 1.69));

  overlay.style.width = `${newWidth}px`;
  overlay.style.height = `${newHeight}px`;

  const scale = window.devicePixelRatio;
  return {
    screenWidth: newWidth,
    screenHeight: newHeight,
    pixelWidth: newWidth * scale,
    pixelHeight: newHeight * scale,
    scale,
  };
}

window.addEventListener('load', () => {
  analytics.log('LOADED');

  const spritesImg = new Image();
  spritesImg.addEventListener('load', () => {

    const overlay = document.getElementById('game');
    const size = resizeOverlay(overlay);

    const scenes = new Scenes([
      new Loading(overlay),
      new MainMenu(overlay),
      new Matchmaking(overlay),
      new GameScene(overlay, spritesImg, size),
      new Disconnected(overlay)
    ]);

    if (SETTINGS.START_WITH_MATCHMAKING) {
      userStorage.get()
        .then(user => {
          scenes.start(Matchmaking, user);
        });
    } else {
      scenes.startDefault();
    }

    window.onresize = () => {
      const size = resizeOverlay(overlay);
      scenes.resize(size);
    };
  });
  spritesImg.src = document.getElementById('sprites').href;
});
