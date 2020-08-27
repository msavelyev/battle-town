const FPS = 30;
const FRAME_TIME = 1000 / FPS;

export default class Ticker {

  constructor(tick, setTimeout, timeFunc) {
    this.tick = tick;

    this.lastFrameTime = 0;
    this.stopped = false;
    this.setTimeout = setTimeout;
    this.timeFunc = timeFunc;
  }

  update() {
    if (this.stopped) {
      return;
    }

    const time = this.timeFunc();
    const delta = time - this.lastFrameTime;
    const remaining = Math.max(FRAME_TIME - delta, 0);

    this.lastFrameTime = time;
    this.tick.update({ delta });
    this.setTimeout(this.update.bind(this), remaining);
  }

  start() {
    this.update();
  }

  stop() {
    this.stopped = true;
  }

}
