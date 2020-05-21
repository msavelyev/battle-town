const FPS = 60;
const FRAME_TIME = 1000 / FPS;

export default class Renderer {

  constructor(canvas, game) {
    this.canvas = canvas;
    this.game = game;

    this.lastFrameTime = 0;
  }


  update(time) {
    const delta = time - this.lastFrameTime;

    if(delta < FRAME_TIME) {
      requestAnimationFrame(this.update.bind(this));
      return; // return as there is nothing to do
    }
    this.lastFrameTime = time;

    this.game.update(this.canvas, {
      time,
      delta
    });
    requestAnimationFrame(this.update.bind(this));
  }

  start() {
    requestAnimationFrame(this.update.bind(this));
  }

}
