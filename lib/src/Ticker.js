const FPS = 60;
export const FRAME_TIME = Math.ceil(1000 / FPS);

export default class Ticker {

  constructor(setInterval, timeFunc) {
    this.scene = null;

    this.lastFrameTime = 0;
    this.stopped = false;
    this.setInterval = setInterval;
    this.timeFunc = timeFunc;
    this.tick = 0;
  }

  update() {
    if (this.stopped) {
      return;
    }

    const time = this.timeFunc();
    const delta = time - this.lastFrameTime;

    this.increaseTickNumber();

    this.lastFrameTime = time;
    this.scene.update({ delta, time, tick: this.tick });
  }

  increaseTickNumber() {
    if (this.tick === 4294967296) {
      this.tick = 0;
    }
    this.tick++;
  }

  start(scene) {
    this.scene = scene;
    this.setInterval(this.update.bind(this), FRAME_TIME);
  }

  stop() {
    this.stopped = true;
  }

}
