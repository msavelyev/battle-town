import MainMenu from './game/scenes/MainMenu.js';
import Loading from './game/scenes/Loading.js';
import GameScene from './game/scenes/GameScene.js';
import Scenes from './game/scenes/Scenes.js';
import Matchmaking from './game/scenes/Matchmaking.js';
import Disconnected from './game/scenes/Disconnected.js';

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

    scenes.start(
      Loading,
      {}
    );
  });
  spritesImg.src = document.getElementById('sprites').href;
});
