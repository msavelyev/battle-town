import MainMenu from './game/scenes/MainMenu.js';
import Loading from './game/scenes/Loading.js';
import GameScene from './game/scenes/GameScene.js';
import Scenes from './game/scenes/Scenes.js';
import Matchmaking from './game/scenes/Matchmaking.js';
import Disconnected from './game/scenes/Disconnected.js';
import userStorage from './game/userStorage.js';

import dotenv, {SETTINGS} from '../../../../lib/src/tanks/lib/util/dotenv.js';
import analytics from '../../../../lib/src/tanks/lib/util/analytics.js';

import landscapeSvg from '../../../public/imgs/landscape.svg';
import '../../../public/main.css';
import * as spritesLoader from './spritesLoader.js';

import './polyfill/object-entries.js';

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
  document.getElementById('landscape-svg').src = landscapeSvg;

  analytics.log('LOADED');

  spritesLoader.loadSpriteSheets(spriteSheet => {
    const overlay = document.getElementById('game');
    const size = resizeOverlay(overlay);

    const scenes = new Scenes([
      new Loading(overlay),
      new MainMenu(overlay),
      new Matchmaking(overlay),
      new GameScene(overlay, spriteSheet),
      new Disconnected(overlay)
    ], size);

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
});
