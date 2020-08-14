const FPS = 70;
const FRAME_TIME = 1000 / FPS;

export default class Ticker {

  constructor(tick, nextFrame) {
    this.tick = tick;

    this.lastFrameTime = 0;
    this.stopped = false;
    this.nextFrame = nextFrame;
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
