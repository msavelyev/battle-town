import MainMenu from '@Client/tanks/client/game/scenes/MainMenu.js';
import Loading from '@Client/tanks/client/game/scenes/Loading.js';
import GameScene from '@Client/tanks/client/game/scenes/GameScene.js';
import Scenes from '@Client/tanks/client/game/scenes/Scenes.js';
import Matchmaking from '@Client/tanks/client/game/scenes/Matchmaking.js';
import Disconnected from '@Client/tanks/client/game/scenes/Disconnected.js';
import userStorage from '@Client/tanks/client/game/userStorage.js';

import dotenv from '@Lib/tanks/lib/util/dotenv.js';
import analytics from '@Lib/tanks/lib/util/analytics.js';

import landscapeSvg from '@Client/tanks/client/assets/imgs/landscape.svg';
import '@Client/tanks/client/assets/main.css';
import * as spritesLoader from '@Client/tanks/client/spritesLoader.js';

import '@Client/tanks/client/polyfill/object-entries.js';

analytics.init();

dotenv.dotenv();

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

    if (dotenv.SETTINGS.START_WITH_MATCHMAKING) {
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
