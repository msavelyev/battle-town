import MainMenu from './game/scenes/MainMenu.js';
import Loading from './game/scenes/Loading.js';
import GameScene from './game/scenes/GameScene.js';
import Scenes from './game/scenes/Scenes.js';
import Matchmaking from './game/scenes/Matchmaking.js';
import Disconnected from './game/scenes/Disconnected.js';
import userStorage from './game/userStorage.js';

import dotenv, {SETTINGS} from '../../lib/src/util/dotenv.js';

dotenv();

window.addEventListener('load', () => {
  const spritesImg = new Image();
  spritesImg.addEventListener('load', () => {

    const overlay = document.getElementById('game');
    const scenes = new Scenes([
      new Loading(overlay),
      new MainMenu(overlay),
      new Matchmaking(overlay),
      new GameScene(overlay, spritesImg),
      new Disconnected(overlay)
    ]);

    if (SETTINGS.START_WITH_MATCHMAKING) {
      userStorage.get()
        .then(user => {
          scenes.start(Matchmaking, user);
        });
    } else {
      scenes.start(Loading, {});
    }
  });
  spritesImg.src = document.getElementById('sprites').href;
});
