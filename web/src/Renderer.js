

const FPS = 60;
const FRAME_TIME = 1000 / FPS;

export default class Renderer {

  constructor(game) {
    this.game = game;

    this.lastFrameTime = 0;
  }


  update(time) {
    if(time - this.lastFrameTime < FRAME_TIME) {
      requestAnimationFrame(this.update.bind(this));
      return; // return as there is nothing to do
    }
    this.lastFrameTime = time;

    this.game.update();
    requestAnimationFrame(this.update.bind(this));
  }

  start() {
    requestAnimationFrame(this.update.bind(this));
  }

}
