const FPS = 60;
const FRAME_TIME = 1000 / FPS;

export default class Ticker {

  constructor(tick) {
    this.tick = tick;

    this.lastFrameTime = 0;
    this.stopped = false;
  }

  nextFrame(func) {
    if (global.requestAnimationFrame) {
      global.requestAnimationFrame(func);
    } else {
      setImmediate(func);
    }
  }

  update() {
    if (this.stopped) {
      return;
    }

    const time = new Date();

    const delta = time - this.lastFrameTime;

    if(delta < FRAME_TIME) {
      this.nextFrame(this.update.bind(this));
      return; // return as there is nothing to do
    }
    this.lastFrameTime = time;

    this.tick.update({ delta });
    this.nextFrame(this.update.bind(this));
  }

  start() {
    this.nextFrame(this.update.bind(this));
  }

  stop() {
    this.stopped = true;
  }

}
