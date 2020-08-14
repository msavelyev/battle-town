
export default class Fps {

  constructor() {
    this.currentFrames = 0;
    this.fps = 0;
    this.time = new Date().getTime();
  }

  update() {
    let currentTime = new Date().getTime();
    if ((currentTime - this.time) < 1000) {
      this.currentFrames += 1;
    } else {
      this.time = currentTime;
      this.fps = this.currentFrames;
      this.currentFrames = 0;
    }
  }

  get() {
    return this.fps;
  }

}
