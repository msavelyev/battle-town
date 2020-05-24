const FPS = 60;
const FRAME_TIME = 1000 / FPS;

export default class Renderer {

  constructor(ctx, game) {
    this.ctx = ctx;
    this.game = game;

    this.lastFrameTime = 0;
    this.stopped = false;
  }


  update(time) {
    if (this.stopped) {
      return;
    }

    const delta = time - this.lastFrameTime;

    if(delta < FRAME_TIME) {
      requestAnimationFrame(this.update.bind(this));
      return; // return as there is nothing to do
    }
    this.lastFrameTime = time;

    this.game.update(this.ctx, {
      time,
      delta
    });
    requestAnimationFrame(this.update.bind(this));
  }

  start() {
    requestAnimationFrame(this.update.bind(this));
  }

  stop() {
    this.stopped = true;
  }

}
